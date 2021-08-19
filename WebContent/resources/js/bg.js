/*

*/

let getBackgrundImage = async () =>{
	
		let prevBackground = JSON.parse(localStorage.getItem('bg-log'));
		
		if(prevBackground && (prevBackground.expiresOn > Date.now())){
			return prevBackground.imgInfo;
		}
		
		
		let imgObject = await requestBackground();
		insertBackgroundLog(imgObject);		
		
		return imgObject;
};

let requestBackground = async () => {
	
	let params = {
		orientation : 'landscape',
		query: 'landscape'
	}
	let queryString = createQueryString(params);
	
	let response = await fetch('https://api.unsplash.com/photos/random?' +queryString,{
							method:'get',
							headers:{Authorization: 'Client-ID CnU8KQyJ4ovqPUBd8JuLZqbFvqbCMPOw86cP0Bb_QM0'}
						});
		let obj = await response.json();
		
		return{
			img : obj.urls.full,
			place : obj.location.title
		}
}


let insertBackgroundLog = (imgObject) => {
   
   let expirationDate = new Date();
   expirationDate = expirationDate.setSeconds(expirationDate.getSeconds() + 10);

   const backgroundLog = {
      expiresOn : expirationDate,
      imgInfo : imgObject
   }
   
   localStorage.setItem('bg-log',JSON.stringify(backgroundLog));
}


let getCoords = () => {
	if(!navigator.geolocation){
		return new Promise((resolve,reject)=>{
			reject();			
		});
	}else{
		return new Promise((resolve,reject)=>{
			navigator.geolocation.getCurrentPosition((position) => {
				resolve(position.coords);
			});
		})
	}
}

let getLocationTemp = async () =>{	
      const OPEN_WEATHER_API_KEY = 'f8623f0692e3030bc42fc7941ade2c93';
      let coords = await getCoords();

      let params = {
            lat:coords.latitude,
            lon:coords.longitude,
            appid:OPEN_WEATHER_API_KEY,
            units:'metric',
            lang:'kr '
      };
      
      let queryString = createQueryString(params);
     
      let url = `https://api.openweathermap.org/data/2.5/weather?${queryString}`;
      let response =  await fetch(url);      
      let obj = await response.json();
      return{
			temp : obj.main.temp,
			place : obj.name
		}
   }

(async ()=>{
	/*배경 이미지와 이미지의 위치정보 랜더링*/
	let background = await getBackgrundImage();
	document.querySelector('body').style.backgroundImage = `url(${background.img})`;
	if(background.place){
		document.querySelector('.footer_text').innerHTML = background.place;
	}
	
	/* 지역과 기온 랜더링 */
	let locationTemp = await getLocationTemp();
	document.querySelector('.location_text').innerHTML = locationTemp.temp + 'º @' + locationTemp.place;
	

})();

