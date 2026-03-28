export const dummyUsers = [
  {
    uid: 'user1',
    name: '김선생',
    handle: '@teacher_kim',
    photoURL: 'https://i.pravatar.cc/150?u=user1',
    bio: '초등학교 3학년 담임입니다. 교육 자료 공유해요!',
    followers: 120,
    following: 45,
  },
  {
    uid: 'user2',
    name: '이수석',
    handle: '@edu_lee',
    photoURL: 'https://i.pravatar.cc/150?u=user2',
    bio: '수석교사. 에듀테크에 관심이 많습니다.',
    followers: 850,
    following: 120,
  },
  {
    uid: 'user3',
    name: '박신규',
    handle: '@new_park',
    photoURL: 'https://i.pravatar.cc/150?u=user3',
    bio: '신규교사 화이팅! 매일매일 배우고 있습니다.',
    followers: 30,
    following: 150,
  },
  {
    uid: 'user4',
    name: '최체육',
    handle: '@pe_choi',
    photoURL: 'https://i.pravatar.cc/150?u=user4',
    bio: '체육 전담 교사. 아이들이 뛰어노는 걸 좋아합니다.',
    followers: 210,
    following: 80,
  },
  {
    uid: 'user5',
    name: '정과학',
    handle: '@sci_jung',
    photoURL: 'https://i.pravatar.cc/150?u=user5',
    bio: '과학 전담. 신기한 실험 자료 올립니다.',
    followers: 400,
    following: 200,
  }
];

export const dummyPosts = [
  {
    id: 'post1',
    userId: 'user1',
    text: '오늘 3학년 아이들과 우리 고장 답사를 다녀왔습니다. 날씨가 너무 좋아서 다행이었어요! ☀️',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 15,
    comments: 3,
    retweets: 2,
    views: 150,
  },
  {
    id: 'post2',
    userId: 'user2',
    text: '새로운 에듀테크 툴을 발견했습니다. 다음 주 수업에 바로 적용해봐야겠네요. 링크 공유합니다. #에듀테크 #수업자료',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 42,
    comments: 8,
    retweets: 12,
    views: 500,
  },
  {
    id: 'post3',
    userId: 'user3',
    text: '학부모 상담 주간이 끝났습니다. 첫 상담이라 많이 긴장했는데 무사히 마쳐서 다행입니다. 선배님들 조언 감사합니다! 😭',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 88,
    comments: 15,
    retweets: 0,
    views: 320,
  },
  {
    id: 'post4',
    userId: 'user4',
    text: '체육대회 준비로 바쁜 나날입니다. 아이들이 다치지 않고 즐겁게 참여할 수 있도록 안전 교육에 신경 써야겠습니다. 🏃‍♂️🏃‍♀️',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    likes: 25,
    comments: 1,
    retweets: 5,
    views: 200,
  },
  {
    id: 'post5',
    userId: 'user5',
    text: '화산 폭발 실험 대성공! 아이들 눈이 휘둥그레지는 걸 보니 뿌듯하네요. 베이킹소다와 식초의 마법 🌋',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    likes: 120,
    comments: 22,
    retweets: 30,
    views: 1200,
  }
];
