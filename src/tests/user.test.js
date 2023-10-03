const test = require('ava');
const axios = require('axios');
const randomstring = require("randomstring");
const faker = require('@faker-js/faker');
let token;
let userId;
let postId;
const EMAIL = `${randomstring.generate(7)}@gmail.com`;
const PASSWORD = `${randomstring.generate(7)}`;

test.before('create account', async t => {

    const res = await axios('http://localhost:3000/users/create', {

        method: 'post',
        data: {
            username: "usernameFromTest",
            email: EMAIL,
            password: PASSWORD
        }
    });

    userId = res.data.user._id
    t.is(res.status, 201);
    t.true(res.data !== undefined);

    const login = await axios('http://localhost:3000/users/login', {

        method: 'post',
        data: {
            email: EMAIL,
            password: PASSWORD
        }
    });

    token = login.data.token;
    t.is(login.status, 200);
    t.is(login.data.message, 'Auth success');
    t.true(login.data !== undefined);
})





test.serial('get user', async t => {
    const res = await axios.get(`http://localhost:3000/users/get/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

    t.is(res.status, 200);
    t.true(res.data !== undefined);
})
test.serial('get all users', async t => {
    const res = await axios.get(`http://localhost:3000/users/get`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

    t.is(res.status, 200);
    t.true(res.data !== undefined);
})

test.serial('edit user', async t => {
    const res = await axios.patch(`http://localhost:3000/users/update/${userId}`,
        {
            data: {
                username: faker.allFakers.ar.animal.bear(),
            }

        },
        {

            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

    t.is(res.status, 200);
    t.true(res.data !== undefined);
})

test.serial('get posts', async t => {
    const res = await axios.get(`http://localhost:3000/posts/get`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

    t.is(res.status, 200);
    t.true(res.data !== undefined);
})

test.serial('create post', async t => {
    const res = await axios.post(`http://localhost:3000/posts/create`,
        {
            data: {
                title: faker.allFakers.ar.animal.bear(),
                body: faker.allFakers.ar.animal.bear()
            }
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
    postId = res.data.post._id;

    t.is(res.status, 201);
    t.true(res.data !== undefined);
})

test.serial('get post', async t => {
    const res = await axios.get(`http://localhost:3000/posts/get/${[postId]}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

    t.is(res.status, 200);
    t.true(res.data !== undefined);
})

test.serial('get my posts', async t => {
    const res = await axios.get(`http://localhost:3000/posts/getMyPosts`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

    t.is(res.status, 200);
    t.true(res.data !== undefined);
})

test.serial('edit post', async t => {
    const res = await axios.patch(`http://localhost:3000/posts/update/${postId}`,
        {
            data: {
                title: faker.allFakers.ar.animal.bear(),
            }

        },
        {

            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

    t.is(res.status, 200);
    t.true(res.data !== undefined);
})

test.serial("delete post", async t => {
    const res = await axios.delete(`http://localhost:3000/posts/delete/${postId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    t.is(res.status, 200);
    t.true(res.data !== undefined);
})


test.after(async t => {
    const res = await axios.delete(`http://localhost:3000/users/delete/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    t.is(res.status, 200);
    t.true(res.data !== undefined);
})
