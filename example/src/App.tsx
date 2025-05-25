import React, { useRef, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { HighlightToolTip } from 'react-native-focus-guide';

const data = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
const tooltipPositions = [
  'topLeft',
  'topCenter',
  'topRight',
  'bottomLeft',
  'bottomCenter',
  'bottomRight',
  'left',
  'right',
] as const;

// Some items allow overlap, some don't
const allowOverlapSettings = [
  false,
  false,
  false,
  true,
  false,
  true,
  true,
  false,
];

// Various shaped button data
const shapeButtons = [
  { id: 1, text: 'Rectangle Button', shape: 'rectangle' },
  { id: 2, text: 'Circle', shape: 'circle' },
  { id: 3, text: 'Card', shape: 'card' },
  { id: 4, text: 'Rounded Button', shape: 'rounded' },
];

// Grid item data
const gridItems = [
  { id: 1, title: 'Photos', emoji: '📷' },
  { id: 2, title: 'Music', emoji: '🎵' },
  { id: 3, title: 'Videos', emoji: '🎬' },
  { id: 4, title: 'Documents', emoji: '📄' },
  { id: 5, title: 'Settings', emoji: '⚙️' },
  { id: 6, title: 'Profile', emoji: '👤' },
];

// Special layout items
const specialItems = [
  { id: 1, title: 'Header Style', type: 'header' },
  { id: 2, title: 'Approve', type: 'approve' },
  { id: 3, title: 'Reject', type: 'reject' },
];

// example
export default function App() {
  // State management for each section's selection
  const [selectedList, setSelectedList] = useState<number | null>(null);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<number | null>(null);
  const [selectedSpecial, setSelectedSpecial] = useState<number | null>(null);

  // Ref arrays for each section
  const listRefs = useRef(data.map(() => React.createRef<any>()));
  const shapeRefs = useRef(shapeButtons.map(() => React.createRef<any>()));
  const gridRefs = useRef(gridItems.map(() => React.createRef<any>()));
  const specialRefs = useRef(specialItems.map(() => React.createRef<any>()));

  const getTooltipPosition = (index: number) => {
    return tooltipPositions[index % tooltipPositions.length];
  };

  const getAllowOverlap = (index: number) => {
    return allowOverlapSettings[index % allowOverlapSettings.length] ?? false;
  };

  const renderTooltip = (
    title: string,
    position: any,
    allowOverlap: boolean,
    extraInfo?: string
  ) => (
    <View
      style={{
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        minWidth: 200,
        maxWidth: '100%',
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 8,
          flexWrap: 'wrap',
        }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 4,
          flexWrap: 'wrap',
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Tooltip Position: {position}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#888',
          marginBottom: 2,
          flexWrap: 'wrap',
        }}
      >
        Allow Overlap: {allowOverlap ? 'Yes' : 'No'}
      </Text>
      {extraInfo && (
        <Text
          style={{
            fontSize: 12,
            color: '#888',
            marginBottom: 2,
            flexWrap: 'wrap',
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {extraInfo}
        </Text>
      )}
      <Text
        style={{
          fontSize: 12,
          color: '#888',
          flexWrap: 'wrap',
        }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        Auto adjustment considering screen boundaries applied
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {/* Section 1: FlatList */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              color: '#333',
            }}
          >
            📋 FlatList Example
          </Text>
          <FlatList
            data={data}
            keyExtractor={(_, i) => String(i)}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                ref={listRefs.current[index]}
                onPress={() => setSelectedList(index)}
                style={{
                  height: 60,
                  margin: 8,
                  backgroundColor: '#f0f0f0',
                  justifyContent: 'center',
                  padding: 16,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 16 }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Section 2: Various shaped buttons */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              color: '#333',
            }}
          >
            🎨 Various Shaped Buttons
          </Text>
          {shapeButtons.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              ref={shapeRefs.current[index]}
              onPress={() => setSelectedShape(index)}
              style={[
                {
                  margin: 8,
                  padding: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                item.shape === 'rectangle' && {
                  backgroundColor: '#e3f2fd',
                  borderRadius: 4,
                  height: 50,
                },
                item.shape === 'circle' && {
                  backgroundColor: '#f3e5f5',
                  borderRadius: 40,
                  width: 80,
                  height: 80,
                },
                item.shape === 'card' && {
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                },
                item.shape === 'rounded' && {
                  backgroundColor: '#e8f5e8',
                  borderRadius: 25,
                  height: 50,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  fontWeight: item.shape === 'card' ? '600' : 'normal',
                }}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 3: Grid layout */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              color: '#333',
            }}
          >
            📱 Grid Layout
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {gridItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                ref={gridRefs.current[index]}
                onPress={() => setSelectedGrid(index)}
                style={{
                  width: '30%',
                  aspectRatio: 1,
                  backgroundColor: '#fff3e0',
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 4 }}>
                  {item.emoji}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 4: Special layout */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              color: '#333',
            }}
          >
            ⭐ Special Layout
          </Text>

          {/* Header style item */}
          <TouchableOpacity
            ref={specialRefs.current[0]}
            onPress={() => setSelectedSpecial(0)}
            style={{
              backgroundColor: '#1976d2',
              borderRadius: 8,
              padding: 20,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Header Style Item
            </Text>
            <Text style={{ color: '#bbdefb', fontSize: 14, marginTop: 4 }}>
              Large-sized button example
            </Text>
          </TouchableOpacity>

          {/* Inline buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 12,
            }}
          >
            <TouchableOpacity
              ref={specialRefs.current[1]}
              onPress={() => setSelectedSpecial(1)}
              style={{
                backgroundColor: '#4caf50',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: 'white', fontSize: 14 }}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={specialRefs.current[2]}
              onPress={() => setSelectedSpecial(2)}
              style={{
                backgroundColor: '#f44336',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: 'white', fontSize: 14 }}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tooltip overlays */}
        {selectedList !== null && (
          <HighlightToolTip
            targetRef={listRefs.current[selectedList]!}
            tooltipPosition={getTooltipPosition(selectedList)}
            allowOverlap={getAllowOverlap(selectedList)}
            offset={{ x: 0, y: 0 }}
            onRequestClose={() => setSelectedList(null)}
          >
            {renderTooltip(
              `${data[selectedList]} Selected`,
              getTooltipPosition(selectedList),
              getAllowOverlap(selectedList),
              'FlatList Item'
            )}
          </HighlightToolTip>
        )}

        {selectedShape !== null && (
          <HighlightToolTip
            targetRef={shapeRefs.current[selectedShape]!}
            tooltipPosition={getTooltipPosition(selectedShape)}
            allowOverlap={getAllowOverlap(selectedShape)}
            offset={{ x: 0, y: 0 }}
            onRequestClose={() => setSelectedShape(null)}
          >
            {renderTooltip(
              `${shapeButtons[selectedShape]!.text} Selected`,
              getTooltipPosition(selectedShape),
              getAllowOverlap(selectedShape),
              `Shape: ${shapeButtons[selectedShape]!.shape}`
            )}
          </HighlightToolTip>
        )}

        {selectedGrid !== null && (
          <HighlightToolTip
            targetRef={gridRefs.current[selectedGrid]!}
            tooltipPosition={getTooltipPosition(selectedGrid)}
            allowOverlap={getAllowOverlap(selectedGrid)}
            offset={{ x: 0, y: 0 }}
            onRequestClose={() => setSelectedGrid(null)}
          >
            {renderTooltip(
              `${gridItems[selectedGrid]!.title} Selected`,
              getTooltipPosition(selectedGrid),
              getAllowOverlap(selectedGrid),
              'Grid Item'
            )}
          </HighlightToolTip>
        )}

        {selectedSpecial !== null && (
          <HighlightToolTip
            targetRef={specialRefs.current[selectedSpecial]!}
            tooltipPosition={getTooltipPosition(selectedSpecial)}
            allowOverlap={getAllowOverlap(selectedSpecial)}
            offset={{ x: 0, y: 0 }}
            onRequestClose={() => setSelectedSpecial(null)}
          >
            {renderTooltip(
              `${specialItems[selectedSpecial]!.title} Selected`,
              getTooltipPosition(selectedSpecial),
              getAllowOverlap(selectedSpecial),
              'Special Layout Item'
            )}
          </HighlightToolTip>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
