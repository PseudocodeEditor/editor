export function getCookie(name) {
  name += "=";
  
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  
  return "";
}

export function setCookie(name, value) {
  const d = new Date();
  d.setTime(99999999999999);
  
  const expires = "expires=" + d.toUTCString();
  
  document.cookie = name + "=" + value + ";" + expires + ";Secure";
}
