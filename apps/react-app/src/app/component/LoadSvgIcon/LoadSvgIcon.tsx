import React from 'react';

export interface LoadSvgIconProps {
  component: any;
  width?: any;
  height?: any;
  fill?: any;
}

export function LoadSvgIcon(props: LoadSvgIconProps) {
  if (!props.component) return null;
  const newProps: any = {};
  if (props.width) newProps.width = props.width;
  if (props.height) newProps.height = props.height;
  if (props.fill) newProps.fill = props.fill;
  return <props.component {...newProps} />;
}

export default LoadSvgIcon;
