function getSeed(string){
	var hash = 0;
	if (string.length == 0) return hash;
	for (i = 0; i < string.length; i++) {
		char = string.charCodeAt(i);
		hash = ((hash<<5)-hash) + char;
		hash = hash & hash;
	}
	return Math.abs(hash);
}

function getRandomGenerator(){
	var initParamA = getSeed(realmName);
	var initParamB = initParamA;
	var mod1=4294967087;
	var mul1=65539;
	var mod2=4294965887;
	var mul2=65537;

	initParamA=initParamA%(mod1-1)+1;
	initParamB=initParamB%(mod2-1)+1;
console.log(initParamA);
	function random(limit){
		initParamA=(initParamA*mul1)%mod1;
		initParamB=(initParamB*mul2)%mod2;
		if(initParamA<limit && initParamB<limit && initParamA<mod1%limit && initParamB<mod2%limit){
			return random(limit);
		}
		return (initParamA+initParamB)%limit;
	}


	return random;
}

