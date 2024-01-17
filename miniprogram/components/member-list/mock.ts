

export const MockMembers = (function() {
  const ans = []
  for (let i = 0; i < 10; i++) {
    ans.push({
        UserId: i,
        Icon: 'https://img95.699pic.com/photo/40250/2360.jpg_wh300.jpg',
        NickName: '韩跳跳韩跳跳韩跳跳韩跳跳韩跳跳',
        Role: 'SuperRole'
      }
    )
  }
  return ans
})()