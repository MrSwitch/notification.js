/**
 * Notification JS
 * Creates Notifications
 * @author Andrew Dodson
 * 
 */
window.Notification = (function(){
	
	var a = [], int, i=0, n;

	function swaptitle(title){
	
		if(a.length>0){
			a.push(title);
		}
		else {
			a = [document.title, title];
		}

		if(!int){
			int = setInterval(function(){
				document.title = a[i++%a.length];
			}, 1000);
		}
	}
	
	function addEvent(el,name,func){
		if(name.match(" ")){
			var a = name.split(' ');
			for(var i=0;i<a.length;i++){
				addEvent( el, a[i], func);
			}
		}
		if(el.addEventListener){
		    el.removeEventListener(name, func, false);
		    el.addEventListener(name, func, false);
		}
		else {
		    el.detachEvent('on'+name, func);
		    el.attachEvent('on'+name, func);
		}
	}
	
	addEvent(window, "focus scroll click", function(){
	
		// if a webkit Notification is open, kill it
		if(n){
			n.cancel();
		}
	
		// dont do any more if we haven't got anything open
		if(a.length===0){
			return;
		}
		clearInterval(int);
		
		int = false;
		document.title = a[0];
		a = [];
		i = 0;
	});

	return {
		requestPermission : function(cb){
			// Setup
			// triggers the authentication to create a notification
	
			// IE9
			if(("external" in window) && ("msIsSiteMode" in window.external)){
				if( !window.external.msIsSiteMode() ){
					window.external.msAddSiteMode();
	 				return true;
				}
				return false;
			}
			else if("webkitNotifications" in window){
				return window.webkitNotifications.requestPermission();
			}
			else {
				return null;
			}
		},
			
		checkPermission : function(){
			// Check whether the current desktop supports notifications and if they are authorised, 
			// 0 (yes they are supported and permission is granted), 
			// 1 (yes they are supported, permission has not been granted), 
			// -1 (Notifications are not supported)
			
			// IE9
			if(("external" in window) && ("msIsSiteMode" in window.external)){
				return window.external.msIsSiteMode()? 0 : 1;
			}
			else if("webkitNotifications" in window){
				return window.webkitNotifications.checkPermission() === 0 ? 0 : 1;
			}
			else {
				return -1;
			}
		},
	
		createNotification : function(icon, title, description, ttl){
			// Create a notification
			// @icon string
			// @title string
			// @description string
			// @ttl string
			
			
			//
			// Swap document.title
			//
			swaptitle(title);			
	
			// 
			// Create Desktop Notifications
			// 
			if(("external" in window) && ("msIsSiteMode" in window.external)){
				if(window.external.msIsSiteMode()){
					window.external.msSiteModeActivate();
					return true;
				}
				return false;
			}
			else if("webkitNotifications" in window){
				if(window.webkitNotifications.checkPermission() === 0){
					n = window.webkitNotifications.createNotification(icon, title, description )
					n.show();
					n.onclick = function(){
						// redirect the user back to the page
						window.focus();
						setTimeout( function(){ n.cancel(); }, 1000);
					};
					if(ttl>0){
						setTimeout( function(){ n.cancel(); }, ttl);
					}
					return n;
				}
				return false;
			}
			else {
				return null;
			}
		}
	};
})();