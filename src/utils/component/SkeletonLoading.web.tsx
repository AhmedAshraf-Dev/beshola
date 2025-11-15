// utils/SkeletonWrapper.js
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DefaultSkeleton = ({ width = 300, height = 200 }) => (
  <div style={{ width, height }}>
    <Skeleton height={120} borderRadius={8} />
    <Skeleton
      height={20}
      width="70%"
      style={{ marginTop: 10, borderRadius: 4 }}
    />
    <Skeleton
      height={20}
      width="50%"
      style={{ marginTop: 10, borderRadius: 4 }}
    />
  </div>
);

const SkeletonWrapper = ({
  isLoading,
  children,
  skeletonProps = {},
  SkeletonComponent, // optional custom layout
}) => {
  if (isLoading) {
    const SkeletonComp = SkeletonComponent || DefaultSkeleton;
    return <SkeletonComp {...skeletonProps} />;
  }

  return <>{children}</>;
};

export default SkeletonWrapper;
