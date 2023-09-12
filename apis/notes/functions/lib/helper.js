'use strict';

module.exports.respond = (statusCode, body) => {
    return {
        statusCode,
        body: JSON.stringify(body)
    };
};
