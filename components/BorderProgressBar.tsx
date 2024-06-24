import React, { Component } from "react";
import { View, Dimensions } from "react-native";

interface BorderProgressBarProps {
  thickness: number;
  progress: number;
}

interface BorderProgressBarState {}

class BorderProgressBar extends Component<
  BorderProgressBarProps,
  BorderProgressBarState
> {
  render() {
    const { thickness, progress } = this.props;
    const clampedProgress = Math.max(Math.min(progress, 1), 0);

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const sectionOneWidth = screenWidth / 2;
    const sectionTwoHeight = screenHeight - thickness;
    const sectionThreeWidth = screenWidth - thickness;
    const sectionFourHeight = screenHeight - thickness;
    const sectionFiveWidth = screenWidth / 2 - thickness;

    const totalDistance =
      sectionOneWidth +
      sectionTwoHeight +
      sectionThreeWidth +
      sectionFourHeight +
      sectionFiveWidth;
    const coveredDistance = totalDistance * clampedProgress;

    const sectionOneCoveredWidth = Math.min(coveredDistance, sectionOneWidth);
    const sectionTwoCoveredHeight = Math.min(
      Math.max(coveredDistance - sectionOneWidth, 0),
      sectionTwoHeight,
    );
    const sectionThreeCoveredWidth = Math.min(
      Math.max(coveredDistance - sectionOneWidth - sectionTwoHeight, 0),
      sectionThreeWidth,
    );
    const sectionFourCoveredHeight = Math.min(
      Math.max(
        coveredDistance -
          sectionOneWidth -
          sectionTwoHeight -
          sectionThreeWidth,
        0,
      ),
      sectionFourHeight,
    );
    const sectionFiveCoveredWidth = Math.min(
      Math.max(
        coveredDistance -
          sectionOneWidth -
          sectionTwoHeight -
          sectionThreeWidth -
          sectionFourHeight,
        0,
      ),
      sectionFiveWidth,
    );

    return (
      <View className="absolute h-full w-full">
        {/* Gray border */}
        <View
          className="absolute z-0 h-full w-full border-gray-700"
          style={{ borderWidth: thickness }}
        />
        {/* Sections of green progress */}
        <View
          className="absolute left-1/2 top-0 z-10 bg-green-500"
          style={{ width: sectionOneCoveredWidth, height: thickness }}
        />
        <View
          className="absolute right-0 z-10 bg-green-500"
          style={{
            top: thickness,
            width: thickness,
            height: sectionTwoCoveredHeight,
          }}
        />
        <View
          className="absolute bottom-0 z-10 bg-green-500"
          style={{
            right: thickness,
            width: sectionThreeCoveredWidth,
            height: thickness,
          }}
        />
        <View
          className="absolute left-0 z-10 bg-green-500"
          style={{
            bottom: thickness,
            width: thickness,
            height: sectionFourCoveredHeight,
          }}
        />
        <View
          className="absolute top-0 z-10 bg-green-500"
          style={{
            left: thickness,
            width: sectionFiveCoveredWidth,
            height: thickness,
          }}
        />
      </View>
    );
  }
}

export default BorderProgressBar;
