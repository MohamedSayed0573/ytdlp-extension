function sendResponse(response?: any): void {}
try {
  throw new Error("test");
} catch (apiErr) {
  sendResponse({
    success: false,
    data: null,
    cached: false,
    message: apiErr,
  });
}
