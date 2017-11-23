
$(function(){
	
	// 获取地址传递的goods_id信息
	var str = window.location.search.substr(1);
	// 字符串截取数组
	var goodsIdArr = str.split("=");
	// 获取商品id信息
	var goodsId = goodsIdArr[1];
	
	console.log(goodsId);
	
	$.get("http://h6.duchengjiu.top/shop/api_goods.php",function(response){
		
		// 
		console.log(response);
		
		$(".title").html(response.data.)
		
		
		
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
})
