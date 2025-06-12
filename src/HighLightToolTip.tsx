import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  findNodeHandle,
  UIManager,
  type LayoutRectangle,
  Dimensions,
  Platform,
  type LayoutChangeEvent,
  InteractionManager,
} from 'react-native';

type TooltipPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

type HighlightOverlayProps = {
  targetRef: React.RefObject<any>;
  children: React.ReactNode;
  onRequestClose: () => void;
  tooltipPosition?: TooltipPosition;
  offset?: { x?: number; y?: number };
  allowOverlap?: boolean;
  androidOffsetY?: number;
};

export const HighlightToolTip: React.FC<HighlightOverlayProps> = ({
  targetRef,
  children,
  onRequestClose,
  tooltipPosition = 'bottom',
  offset = { x: 0, y: 0 },
  allowOverlap = false,
  androidOffsetY = 0,
}) => {
  const [hole, setHole] = useState<LayoutRectangle | null>(null);
  const [tooltipLayout, setTooltipLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  useEffect(() => {
    const measure = (retryCount = 0) => {
      if (!targetRef.current) {
        if (retryCount < 5) {
          setTimeout(() => measure(retryCount + 1), 100);
        }
        return;
      }
      const handle = findNodeHandle(targetRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          if (
            [x, y, width, height].some(
              (val) => typeof val !== 'number' || isNaN(val)
            ) ||
            (width === 0 && height === 0)
          ) {
            if (retryCount < 5) {
              setTimeout(() => measure(retryCount + 1), 100);
            } else {
              console.warn(
                'HighlightToolTip: Failed to measure target component after multiple retries.'
              );
              onRequestClose();
            }
            return;
          }

          const isAndroid = Platform.OS === 'android';
          setHole({
            x,
            y: isAndroid ? y + androidOffsetY : y,
            width,
            height,
          });
        });
      } else if (retryCount < 5) {
        setTimeout(() => measure(retryCount + 1), 100);
      } else {
        console.warn(
          'HighlightToolTip: Could not find node handle for targetRef after multiple retries.'
        );
        onRequestClose();
      }
    };

    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      measure();
    });

    return () => interactionHandle.cancel();
  }, [targetRef, androidOffsetY, onRequestClose]);

  const onTooltipLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (tooltipLayout?.width !== width || tooltipLayout?.height !== height) {
      setTooltipLayout({ width, height });
    }
  };

  const getTooltipPosition = () => {
    if (!hole || !tooltipLayout) {
      return { top: 0, left: 0, opacity: 0 };
    }

    const { x: offsetX = 0, y: offsetY = 0 } = offset;
    const margin = allowOverlap ? -4 : 24;
    const { width: tooltipWidth, height: tooltipHeight } = tooltipLayout;

    let calculatedPosition = { top: 0, left: 0 };

    switch (tooltipPosition) {
      case 'topLeft':
        calculatedPosition = {
          top: hole.y - tooltipHeight - margin,
          left: hole.x,
        };
        break;
      case 'topCenter':
        calculatedPosition = {
          top: hole.y - tooltipHeight - margin,
          left: hole.x + hole.width / 2 - tooltipWidth / 2,
        };
        break;
      case 'topRight':
        calculatedPosition = {
          top: hole.y - tooltipHeight - margin,
          left: hole.x + hole.width - tooltipWidth,
        };
        break;
      case 'bottomLeft':
        calculatedPosition = {
          top: hole.y + hole.height + margin,
          left: hole.x,
        };
        break;
      case 'bottomCenter':
        calculatedPosition = {
          top: hole.y + hole.height + margin,
          left: hole.x + hole.width / 2 - tooltipWidth / 2,
        };
        break;
      case 'bottomRight':
        calculatedPosition = {
          top: hole.y + hole.height + margin,
          left: hole.x + hole.width - tooltipWidth,
        };
        break;
      case 'left':
        calculatedPosition = {
          top: hole.y + hole.height / 2 - tooltipHeight / 2,
          left: hole.x - tooltipWidth - margin,
        };
        break;
      case 'right':
        calculatedPosition = {
          top: hole.y + hole.height / 2 - tooltipHeight / 2,
          left: hole.x + hole.width + margin,
        };
        break;
      case 'center':
        calculatedPosition = {
          top: hole.y + hole.height / 2 - tooltipHeight / 2,
          left: hole.x + hole.width / 2 - tooltipWidth / 2,
        };
        break;
      case 'top': // Legacy compatibility
        calculatedPosition = {
          top: hole.y - tooltipHeight - margin,
          left: hole.x,
        };
        break;
      case 'bottom': // Legacy compatibility
        calculatedPosition = {
          top: hole.y + hole.height + margin,
          left: hole.x,
        };
        break;
      default:
        calculatedPosition = {
          top: hole.y + hole.height + margin,
          left: hole.x,
        };
    }

    let { top, left } = calculatedPosition;
    const boundaryMargin = 16;

    if (left < boundaryMargin) {
      left = boundaryMargin;
    }

    if (left + tooltipWidth > screenWidth - boundaryMargin) {
      left = screenWidth - tooltipWidth - boundaryMargin;
    }

    if (top < boundaryMargin) {
      if (tooltipPosition.includes('top')) {
        top = hole.y + hole.height + (allowOverlap ? -4 : 24);
      } else {
        top = boundaryMargin;
      }
    }

    if (top + tooltipHeight > screenHeight - boundaryMargin) {
      if (tooltipPosition.includes('bottom')) {
        top = hole.y - tooltipHeight - (allowOverlap ? -4 : 24);
      } else {
        top = screenHeight - tooltipHeight - boundaryMargin;
      }
    }

    return {
      top: top + offsetY,
      left: left + offsetX,
      opacity: 1,
      maxWidth: screenWidth * 0.9,
    };
  };

  const isHoleLayoutInvalid =
    !hole || [hole.x, hole.y, hole.width, hole.height].some(isNaN);

  if (isHoleLayoutInvalid) {
    return null;
  }

  const tooltipStyle = getTooltipPosition();

  return (
    <Modal transparent visible onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={{ flex: 1 }}>
          {/* Top overlay */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: hole.y,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          />

          {/* Left overlay */}
          <View
            style={{
              position: 'absolute',
              top: hole.y,
              left: 0,
              width: hole.x,
              height: hole.height,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          />

          {/* Right overlay */}
          <View
            style={{
              position: 'absolute',
              top: hole.y,
              left: hole.x + hole.width,
              right: 0,
              height: hole.height,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          />

          {/* Bottom overlay */}
          <View
            style={{
              position: 'absolute',
              top: hole.y + hole.height,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          />

          {/* Tooltip */}
          <View
            onLayout={onTooltipLayout}
            style={{
              position: 'absolute',
              top: tooltipStyle.top,
              left: tooltipStyle.left,
              opacity: tooltipStyle.opacity,
              maxWidth: tooltipStyle.maxWidth,
            }}
          >
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default HighlightToolTip;
