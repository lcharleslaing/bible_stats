export async function get({ query }) {
    const videoId = query.get('videoId');
    const startTime = query.get('startTime');
    const url = `https://www.youtube.com/watch?v=${videoId}&t=${startTime}s`;

    return {
        status: 302,
        headers: {
            'Location': url
        }
    };
}


