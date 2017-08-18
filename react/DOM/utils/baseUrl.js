import url from 'url';

const baseUrl = () => {
    const u = url.parse(window.location.href);
    return url.format({
        protocol: u.protocol,
        auth: u.auth,
        host: u.host,
        port: u.port
    });
};

export default baseUrl;
