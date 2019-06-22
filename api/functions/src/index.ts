import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { apiKey, apiSecret, appId } from './constant';
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
                resourceOwnerId: appId,
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
        try {
            let response = await axios.post(
                'https://api.partners.scb/partners/sandbox/v1/oauth/token',
                {
                    headers: {
                        'content-type': 'application/json',
                        // resourceOwnerId: apiKey,
                        resourceOwnerId: appId,
                        requestUId: uuid(),
                        // 'accept-language': 'TH',
                        'accept-language': 'EN',
                    },
                    body: {
                        applicationKey: apiKey,
                        applicationSecret: apiSecret,
                        authCode: req.query.code,
                    },
                },
            );
            if (response.status !== 200) {
                return res
                    .status(response.status)
                    .send({ error: response.data.status.description });
            }
            const tokenItem = response.data.data;
            console.log(response.data);
            response = await axios.get(
                'https://api.partners.scb/partners/sandbox/v1/customers/profile',
                {
                    headers: {
                        authorization: `Bearer ${tokenItem.accessToken}`,
                        // resourceOwnerId: apiKey,
                        resourceOwnerId: appId,
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
            return res.send({ token, ...response.data.data });
        } catch (error) {
            console.log(error);
            throw error;
        }
    });
});

export const refreshToken = functions.https.onRequest(async (req, res) => {
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

export const deeplink = functions.https.onRequest(async (req, res) => {
    const { status, data } = await axios.post(
        'https://api.partners.scb/partners/sandbox/v2/deeplink/transactions',
        {
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${req.headers.token}`,
                resourceOwnerId: appId,
                requestUId: uuid(),
                channel: 'scbeasy',
                'accept-language': 'TH',
            },
            body: {
                paymentAmount: req.body.paymentAmount,
                transactionType: 'PAYMENT',
                transactionSubType: 'BPA',
                ref1: uuid(),
                accountTo: req.body.accountTo,
            },
        },
    );
    if (status !== 200) {
        res.send(status).send({ error: data.status.description });
    } else {
        res.send(data.data);
    }
});
