export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission errors.
 * It includes context about the failed request to provide better debugging information.
 */
export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(
      {
        context: {
            // Replicating the structure of a real contextual error for consistency
            request: {
                // In a real scenario, we'd get this from the auth context
                auth: { uid: 'SIMULATED_USER_ID', token: {} },
            },
            resource: {
                // This is the data that was being written
                data: context.requestResourceData,
            }
        },
        // These are the most important fields for debugging
        path: context.path,
        operation: context.operation,
      },
      null,
      2
    )}`;

    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is necessary for the error to be properly displayed in some environments
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
