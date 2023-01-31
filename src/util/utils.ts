
const getRandomId = () => {
  var ints = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'o', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  var res = "";
  for (var i = 0; i < 5; i++) {
    var id = Math.floor(Math.random() * 10);
    res += ints[id];
  }
  // res += '-'
  for (var i = 0; i < 5; i++) {
    var id = Math.floor(Math.random() * 26);
    res += chars[id];
  }
  // res += '-'
  for (var i = 0; i < 5; i++) {
    var id = Math.floor(Math.random() * 10);
    res += ints[id];
  }
  // res += '-'
  for (var i = 0; i < 5; i++) {
    var id = Math.floor(Math.random() * 26);
    res += chars[id];
  }
  return res;
}


export {
  getRandomId
}