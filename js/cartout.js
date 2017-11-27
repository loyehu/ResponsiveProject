
$(function(){
	
//	console.log(document.documentElement.clientWidth);
	
	// 新建收货人地址信息
	$(".save-address").click(function(){
		// 表单序列化
		var data = $("form").serialize();
//		alert(data);
		$(".cartout-form-row").stop().slideUp();
		if( $(".newAddress-col input").is(":checked") ){
			$(".newAddress-col input")[0].checked = false;
		}
		
		$(".newAddress").show();
		$(".cartout-form input").val("");
		$.ajax({
			"type":"POST",
			"url":"http://h6.duchengjiu.top/shop/api_useraddress.php?token=" + localStorage.token + "&status=add",
			"data": data,
			"dataType": "json",
			"success": function(response){
				if(response.code === 0){
//					console.log(response);
					addressAjax();
				}
			}
		});
	})
	addressAjax();
	// 页面显示收货人地址信息
	function addressAjax(){
		
		$.ajax({
			"url": "http://h6.duchengjiu.top/shop/api_useraddress.php?token="+localStorage.token,
			"type": "POST",
			"dataType": "json",
			"success": function(response){
//				console.log(response);
				var html = "";
				for(var i = 0; i < response.data.length; i++){
					
					html += `<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 address-list" data-id="${response.data[i].address_id}">
								<div class="address-li">
									<p class="person-infor">
										<span>${response.data[i].address_name}</span>
										<span>${response.data[i].mobile}</span>
									</p>
									<p class="province-city">
										${response.data[i].mobile}&nbsp;&nbsp;${response.data[i].city}&nbsp;&nbsp;${response.data[i].district}
									</p>
									<p class="detail-address">
										${response.data[i].address}
									</p>
									<p class="compile">编辑</p>
									<p class="delete">删除</p>
									<div class="clear"></div>
								</div>
							</div>`
				}
				$("#address-list").html(html);
				
				// 判断后台数据中是否存在地址
				if( response.data.length == 0){
					$(".cartout-form-row").show();
					$(".newAddress").hide();
					return ;
				}
				
				
//				console.log($(".delete"))
				
				// 删除地址事件
				$(".delete").click(function(){
					alert("您确定删除该地址信息!")
					var addressList = this.parentNode.parentNode;
//					console.log(addressList);
					addressList.parentNode.removeChild(addressList);
					
					// 删除数据库中存储的地址信息
					removeAjaxAddress(addressList);
				})
			
			}
		})
	}
	// 点击显示地址输入栏
	$(".newAddress-col input").click(function(){
		if($(".newAddress-col input").is(":checked")){
			$(".cartout-form-row").stop().slideDown();
		}else{
			$(".cartout-form-row").stop().slideUp();
		}
	})
	
	// 删除后台数据库地址信息函数
	function removeAjaxAddress(obj){
		
		var dataId = $(obj).attr("data-id");
//		console.log(dataId);
		
		$.ajax({
			"type":"GET",
			"url":"http://h6.duchengjiu.top/shop/api_useraddress.php?token=" + localStorage.getItem("token") + "&status=delete",
			"data": {
				"address_id": dataId
			},
			"dataType": "json",
			"success": function(response){
//				console.log(response);
				if(response.data.length == 0){
					$(".cartout-form-row").show();
					$(".cartout-form input").val("");
					$(".newAddress").hide();
					return ;
				}
			}
		});		
	}
	
	// 商品总价变量
	var sumtotal = 0;
	
	// 订单详情
	lineItem();
	function lineItem(){
		$.ajax({
			"url": "http://h6.duchengjiu.top/shop/api_order.php?token="+localStorage.token,
			"type": "POST",
			"dataType": "json",
			"success": function(response){
				if(response.code === 0){
//					console.log(response);
					
					var html = "";
					// 订单循环
					for(var i = 0; i < response.data.length; i++){
						var obj = response.data[i]
			
						html += '<div class="lineItem-order">订单号: ' + obj.order_id;

						// 订单详情循环
						for(var j = 0; j < obj.goods_list.length; j++){

							var goodsListItem = obj.goods_list[j];
							
							// 商品金额计算
							sumtotal += goodsListItem.goods_number * goodsListItem.goods_price;
							
							html += `<div class="row lineItem">
										<div class="line-item-img">
											<img src="${goodsListItem.goods_thumb}" />
										</div>
										<div class="line-item-name">
											${goodsListItem.goods_name}
										</div>
										<div class="line-item-number">
											x${goodsListItem.goods_number}
										</div>
										<div class="line-item-price">
											￥${goodsListItem.goods_price}
										</div>
									</div>`
						}
						
						html += '</div>'
					}
					
					$(".cartout-line-item").html(html);	
					
					console.log($(".clearing-text span"));
					$(".clearing-text span").html("￥" + sumtotal + ".00元");
				}
			}
		})
		
	}
	
	
	var lock = true;
	
	// 订单详情收起
	$(".line-item-icon").click(function(){
		
		if(lock){
			$(".cartout-line-item").stop(true,true).slideUp();
			$(".line-item-icon").css({"background": "url(../img/open_down.png)no-repeat left top"})
		}else{
			$(".cartout-line-item").stop(true,true).slideDown();
			$(".line-item-icon").css({"background": "url(../img/open_up.png)no-repeat left top"})
		}
		lock = !lock;
	})

	


	
}) // 页面加载完成函数结束括号
