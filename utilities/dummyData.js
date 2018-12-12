const paymentHistory = {
    time: new Date('22:30 12/11/2018').getTime(),
    to: 'xyfkdnakasklffalskjnfdaksfn',
    amount: 1000
}

const tweets = {
    from: 'aaaaaasafafaffdfhhkwthmt',
    time: new Date('22:30 12/11/2018').getTime(),
    keys: [], //Key size = 0 => no encrypt | Key size = 1 => only me 
    content: '{ type: String }', // Maximum length 65536 in bytes
    imgUrl: '',
    replies: [{
      from: '1avstwrgnwngfvjvkejk',
      time: new Date('22:50 12/11/2018').getTime(),
      content: '{ type: String, required: true }'
    }],
    likes: [{
      from: 'innacieo1ofjdnajncjsana',
      time:  new Date('22:50 12/11/2018').getTime()
    }]
}

const dummyAcc ={
    address: 'abcdefghijklmneofasdnonasndfa',
    balance: '10000',
    sequence: '5',
    bandwidth: '10000',
    bandwidthTime: new Date('12/11/2018').getTime(),
    displayName: 'Vi Văn',
    username: '@vhv81hx',
    avatarUrl: '',
    coverPhotoUrl: '',
    bio: 'i am the bone of my sword',
    location: 'somewhere in neverland',
    joinDate: new Date('22:30 11/11/2018').getTime(),
    paymentHistory: [paymentHistory, paymentHistory],
    tweets: [tweets],
    followings: [],
    followers: []
}

module.exports = dummyAcc;