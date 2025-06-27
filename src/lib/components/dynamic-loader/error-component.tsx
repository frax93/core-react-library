export function createErrorComponent(id: string) {
  const ErrorComponent = () => <p>Error loading remote component: {id}</p>;
  ErrorComponent.displayName = `ErrorComponent(${id})`;
  return ErrorComponent;
}
