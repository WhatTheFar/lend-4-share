import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { apiKey, apiSecret, billerId } from './constant';
import { v4 as uuid } from 'uuid';

admin.initializeApp();

const cors = require('cors')({
    origin: true,
});

export const ping = functions.https.onRequest((req, res) => {
    res.send({ message: 'pong' });
});

export const login = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const response = await axios({
            method: 'get',
            url: `https://api.partners.scb/partners/sandbox/v2/oauth/authorize`,
            headers: {
                apikey: apiKey,
                apisecret: apiSecret,
                resourceOwnerId: apiKey,
                requestUId: uuid(),
                'response-channel': 'mobile',
                endState: 'mobile_app',
            },
        });
        const { status, data } = response;
        if (status !== 200) {
            res.status(status).send({ error: data.status.description });
        } else {
            res.send(data.data);
        }
    });
});

export const token = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        let response = await axios.post(
            'https://api.partners.scb/partners/sandbox/v1/oauth/token',
            {
                applicationKey: apiKey,
                applicationSecret: apiSecret,
                authCode: req.query.code,
            },
            {
                headers: {
                    'content-type': 'application/json',
                    resourceOwnerId: apiKey,
                    requestUId: uuid(),
                    'accept-language': 'TH',
                },
                validateStatus: function(status) {
                    return true; // Reject only if the status code is greater than or equal to 500
                },
            },
        );
        const resourceOwnerId = response.headers.resourceownerid;
        if (response.status !== 200) {
            return res
                .status(response.status)
                .send({ error: response.data.status.description });
        }
        const tokenInfo = response.data.data;
        response = await axios.get(
            'https://api.partners.scb/partners/sandbox/v1/customers/profile',
            {
                headers: {
                    authorization: `Bearer ${tokenInfo.accessToken}`,
                    resourceOwnerId: resourceOwnerId,
                    requestUId: uuid(),
                    'accept-language': 'TH',
                },
            },
        );
        if (response.status !== 200) {
            return res
                .status(response.status)
                .send({ error: response.data.status.description });
        }
        return res.send({
            token: tokenInfo,
            resourceOwnerId,
            ...response.data.data,
        });
    });
});

export const refreshToken = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const { status, data } = await axios.post(
            'https://api.partners.scb/partners/sandbox/v1/oauth/token/refresh',
            {
                headers: {
                    'content-type': 'application/json',
                    resourceOwnerId: apiKey,
                    requestUId: req.query.requestuid,
                    'accept-language': 'TH',
                },
                body: {
                    applicationKey: apiKey,
                    applicationSecret: apiSecret,
                    refreshToken: req.body.refreshToken,
                },
            },
        );
        if (status !== 200) {
            res.status(status).send({ error: data.status.message });
        } else {
            res.send(data.data);
        }
    });
});

export const deeplink = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }
        const { status, data } = await axios.post(
            'https://api.partners.scb/partners/sandbox/v2/deeplink/transactions',
            {
                paymentAmount: req.body.paymentAmount,
                transactionType: 'PAYMENT',
                transactionSubType: 'BPA',
                ref1: "1234",
                ref2: "1234",
                ref3: "1234",
                accountTo: billerId,
            },
            {
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${req.headers.token}`,
                    resourceOwnerId: req.body.resourceOwnerId,
                    requestUId: uuid(),
                    channel: 'scbeasy',
                    'accept-language': 'EN',
                },
                validateStatus: function() {
                    return true; // Reject only if the status code is greater than or equal to 500
                },
            },
        );
        console.log('res', req.body.resourceOwnerId);
        console.log('token', req.headers.token);
        console.log(data);
        console.log('===================================');
        if (status !== 201) {
            console.log('Not 200');
            return res.status(status).send({ error: data.status.description });
        } else {
            console.log('200');
            return res.send(data.data);
        }
    });
});
