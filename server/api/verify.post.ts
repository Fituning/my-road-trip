/**
 * API Endpoint: /api/verify
 * Method: POST
 * Description: Verifies the provided PIN code against the environment variables.
 * Sets a cookie if authentication is successful to maintain the session.
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Retrieve the secret PIN from the server environment variables
    const validPin = process.env.NUXT_APP_PIN_CODE || '1234';

    if (body.pin === validPin) {
        // Set an authentication cookie valid for 30 days
        setCookie(event, 'auth_unlocked', 'true', {
            maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
            httpOnly: false,           // Must be readable by the Vue client script
            path: '/'
        });

        return { success: true };
    }

    // Reject invalid attempts
    throw createError({
        statusCode: 401,
        statusMessage: 'Invalid PIN code',
    });
});