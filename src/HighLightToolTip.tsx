import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  findNodeHandle,
  UIManager,
  type LayoutRectangle,
  Dimensions,
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
};

export const HighlightToolTip: React.FC<HighlightOverlayProps> = ({
  targetRef,
  children,
  onRequestClose,
  tooltipPosition = 'bottom',
  offset = { x: 0, y: 0 },
  allowOverlap = false,
}) => {
  const [hole, setHole] = useState<LayoutRectangle | null>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  useEffect(() => {
    if (!targetRef.current) return;
    const handle = findNodeHandle(targetRef.current);
    UIManager.measureInWindow(
      handle!,
      (x: number, y: number, width: number, height: number) => {
        setHole({ x, y, width, height });
      }
    );
  }, [targetRef]);

  const getTooltipPosition = () => {
    if (!hole) return { top: 0, left: 0 };

    const { x: offsetX = 0, y: offsetY = 0 } = offset;
    // Adjust margin based on allowOverlap - use larger margin to prevent overlap
    const margin = allowOverlap ? -4 : 24; // Negative margin when overlap is allowed, otherwise larger margin

    // Calculate tooltip size dynamically based on screen size
    const maxTooltipWidth = Math.min(screenWidth * 0.8, 320); // Max 80% of screen width or 320px
    const tooltipWidth = maxTooltipWidth;
    const tooltipHeight = 120; // Adjust to actual height + extra space

    // Calculate initial position
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

    // Check screen boundaries and auto-adjust
    let { top, left } = calculatedPosition;

    // Fixed margin for screen boundary adjustment (always positive)
    const boundaryMargin = 16;

    // Left boundary check
    if (left < boundaryMargin) {
      left = boundaryMargin;
    }

    // Right boundary check - ensure tooltip doesn't extend beyond screen
    if (left + tooltipWidth > screenWidth - boundaryMargin) {
      left = screenWidth - tooltipWidth - boundaryMargin;
      // If still not enough space, adjust tooltip width
      if (left < boundaryMargin) {
        left = boundaryMargin;
      }
    }

    // Top boundary check
    if (top < boundaryMargin) {
      // If it goes above, move to bottom - maintain allowOverlap setting
      if (tooltipPosition.includes('top')) {
        top = hole.y + hole.height + (allowOverlap ? -4 : 24);
      } else {
        top = boundaryMargin;
      }
    }

    // Bottom boundary check
    if (top + tooltipHeight > screenHeight - boundaryMargin) {
      // If it goes below, move to top - maintain allowOverlap setting
      if (tooltipPosition.includes('bottom')) {
        top = hole.y - tooltipHeight - (allowOverlap ? -4 : 24);
      } else {
        top = screenHeight - tooltipHeight - boundaryMargin;
      }
    }

    return {
      top: top + offsetY,
      left: left + offsetX,
      maxWidth: tooltipWidth,
    };
  };

  if (!hole) return null;

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
            style={{
              position: 'absolute',
              top: tooltipStyle.top,
              left: tooltipStyle.left,
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
