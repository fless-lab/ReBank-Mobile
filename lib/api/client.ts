export interface ApiError {
    message: string;
    status?: number;
}

export const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockCall<T>(data: T, shouldSucceed = true): Promise<T> {
    await delay(800 + Math.random() * 500);

    if (!shouldSucceed) {
        throw { message: 'Network request failed. Please try again.', status: 500 } as ApiError;
    }

    return data;
}

export const apiClient = {
    // get: ...,
    // post: ...,
    // put: ...,
    // delete: ...
};
