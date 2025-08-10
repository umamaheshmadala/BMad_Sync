export const serve = (handler: (req: Request) => Response | Promise<Response>) => {
  // No-op mock; tests can import and directly call handlers
  return handler;
};


