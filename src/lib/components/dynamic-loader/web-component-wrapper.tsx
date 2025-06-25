import React from 'react';

type WebComponentWrapperProps = {
  elementName: string;
  inputsAndHandlers?: Record<string, unknown>;
  children?: React.ReactNode;
};

const WebComponentWrapper: React.FC<WebComponentWrapperProps> = ({
  elementName,
  inputsAndHandlers,
  children,
}) => {
  return React.createElement(elementName, inputsAndHandlers, children);
};

WebComponentWrapper.displayName = 'WebComponentWrapper';

export function createWebComponentWrapper(
  elementName: string,
  inputsAndHandlers?: Record<string, unknown>,
) {
  const Component = ({ children }: { children?: React.ReactNode }) => (
    <WebComponentWrapper elementName={elementName} inputsAndHandlers={inputsAndHandlers}>
      {children}
    </WebComponentWrapper>
  );
  Component.displayName = `WebComponentWrapper(${elementName})`;
  return Component;
}
