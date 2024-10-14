import {
    DDPRateLimiter
} from 'meteor/ddp-rate-limiter';

export const addDDPRule = (methods, count = 10, perSecond = 1000) => {
    // Only allow 5 method calls  operations per connection per second
    DDPRateLimiter.addRule({
        name(name) {
            console.log("method", name)
            return Object.keys(methods).includes(name);
        },

        // Rate limit per connection ID
        connectionId() {
            return true;
        },
    }, count, perSecond);

}