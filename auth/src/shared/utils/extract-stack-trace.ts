export function extractStackTrace(stack: string): string {
    const match = / at (.+)/.exec(stack);
    return match ? match[1] : stack;
}