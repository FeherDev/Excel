

// sample event handlers
	function onClickFeature( evt )
	{
		this.openDetailWindow( this.getFeatureId() );
	};

	function onContextMenuFeature( evt )
	{
		var oMenu = evt.mParameters.menu;
		oMenu.addItem( new sap.ui.unified.MenuItem( { text : this.getFeatureId() } ) );
		this.openContextMenu( oMenu );
	};
	
	function onClickFC( evt )
	{
		alert( "Hello " + evt.mParameters.featureId );
	};

	function onContextMenuFC( evt )
	{
		alert( "onContextMenuFC " + evt.mParameters.featureId );
	};


sap.ui.define([
				"sap/ui/model/json/JSONModel",
				"sap/ui/Device"
               ],function(JSONModel, Device) {
	"use strict";

	sap.ui.controller("geomap.geomap", {
	
		onInit : function () {
			var oVBI = this.getView().byId('vbi');

			  var oMapConfig = {
				        "MapProvider": [{
				            "name": "Openstreetmap",
				            "copyright": "<b><a href='http://www.openstreetmap.org/copyright'>© openstreetmap</a></b>",
				            "Source": [{
				            	"id": "s1",
				            	"url": "http://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
					            }
				            	]
				        }],
				        "MapLayerStacks": [{
				                "name": "DEFAULT",
				                "MapLayer": {
				                        "name": "layer1",
				                        "refMapProvider": "Openstreetmap",
				                        "opacity": "1",
				                        "colBkgnd": "RGB(255,255,255)"
				                }
				        }]
				    };
			  oVBI.setMapConfiguration(oMapConfig);
			  oVBI.setRefMapLayerStack("DEFAULT");
			  oVBI.setInitialZoom(7);
			  //var gjLayer = new sap.ui.vbm.GeoJsonLayer({srcURL:"geojson/admin_8.json"});
			  //var gjLayer2 = new sap.ui.vbm.GeoJsonLayer({srcURL:"geojson/megyek.json"});
		      //oVBI.addGeoJsonLayer(gjLayer);
		      //oVBI.addGeoJsonLayer(gjLayer2)
			  var oModel = new sap.ui.model.json.JSONModel("geojson/megyek.json");

			  this.oVBI = this.getView().byId("vbi");
			  this.getView().setModel(oModel);
			  
			  var oDeviceModel = new JSONModel(Device);
			  oDeviceModel.setDefaultBindingMode("OneWay");
			  this.getView().setModel(oDeviceModel, "device");
			

			  
			  this.addFeatureCollection(0);
		 },
	
		 addFeatureCollection : function ( currentDetailLevel ) {
			   this.FCRef = new sap.ui.vbm.FeatureCollection( {
				   
				   click : onClickFC,
				   contextMenu: onContextMenuFC,
				   srcURL: (!currentDetailLevel) ?  "geojson/megyek.json" : "geojson/keruletek.json",
						   items: {
							   path:"/features",
							   template: new sap.ui.vbm.Feature({
								   color:'{}',
								   featureId:'{properties/NAME_1}',
								   click: onClickFeature,
								   contextMenu: onContextMenuFeature
								   
							   })
						   }

					   });
			   this.oVBI.addFeatureCollection(this.FCRef);
			},
			onZoomChanged : function (e) {
				   var oVBI = this.oVBI;
				   
				      var switchZoomLevel = 8;
				      var zl = e.getParameter( "zoomLevel" );
				         if (zl > switchZoomLevel){				         
				            this.currentDetailLevel = 1;
				         } else if (zl <= switchZoomLevel ){
				            this.currentDetailLevel = 0;
				         }
				         oVBI.removeFeatureCollection(this.FCRef);	
				         this.addFeatureCollection(this.currentDetailLevel);	
			},
		 onPressLegend: function ()	{
			 if(this.byId("vbi").getLegendVisible()==true){
				 this.byId("vbi").setLegendVisible(false);
				 this.byId("btnLegend").setTooltip("Show legend");
			 }
			 else{
				 this.byId("vbi").setLegendVisible(true);
				 this.byId("btnLegend").setTooltip("Hide legend");
			 }
		},

		onPressResize: function ()	{
			if(this.byId("btnResize").getTooltip()=="Minimize"){
				if (sap.ui.Device.system.phone) {
					this.byId("vbi").minimize(132,56,1320,560);//Height: 3,5 rem; Width: 8,25 rem
				} else {
					this.byId("vbi").minimize(168,72,1680,720);//Height: 4,5 rem; Width: 10,5 rem
				}				
				this.byId("btnResize").setTooltip("Maximize");
			}
			else{
				this.byId("vbi").maximize();
				this.byId("btnResize").setTooltip("Minimize");
			}
		},
	 
		 onClickAreas: function (evt)   {
	//	    alert("onClickArea");
		 },
	   
		 onClickArea: function (evt)	{
	//		alert("onClickArea");
			evt.getSource().openDetailWindow("My Detail Window", "0", "0" );   		
		},

		onContextMenuItem: function ( evt )	{
	//		alert("onContextMenu");
		},
	
		onContextMenuArea: function ( evt )   {
	//      alert("onContextMenuArea");
	      if ( evt.mParameters && evt.mParameters.menu )
	      { 
	         //Function to handle the select event of the items
	         var handleSelect = function(oEvent){
	            sap.m.MessageToast.show( "clicked on " + oEvent.oSource.mProperties.text );
            
	         };

	         // Create the menu
	         var oMenu11 = evt.mParameters.menu;
	         //Create the items and add them to the menu
	         var oMenuItem11 = new sap.ui.unified.MenuItem({text: "First Item"}); 
	         oMenuItem11.attachSelect(handleSelect);
	         oMenu11.addItem(oMenuItem11);
	         var oMenuItem12 = new sap.ui.unified.MenuItem({text: "Second Item"});
	         oMenuItem12.attachSelect(handleSelect);
	         oMenu11.addItem(oMenuItem12);
	         var oMenuItem13 = new sap.ui.unified.MenuItem({text: "Disabled Item", enabled: false});
	         oMenu11.addItem(oMenuItem13);

	         //Create a sub menu for second item
	         var oMenu21 = new sap.ui.unified.Menu({ariaDescription: "a sub menu"});
	         oMenuItem12.setSubmenu(oMenu21);
	         //Create the items and add them to the sub menu
	         var oMenuItem14 = new sap.ui.unified.MenuItem({text: "New TXT file", tooltip: "Creates a new TXT file."});
	         oMenuItem14.attachSelect(handleSelect);
	         oMenu21.addItem(oMenuItem14);
	         var oMenuItem15 = new sap.ui.unified.MenuItem({text: "New RAR file", tooltip: "Creates a new RAR file."});
	         oMenuItem15.attachSelect(handleSelect);
	         oMenu21.addItem(oMenuItem15);

	         evt.getSource().openContextMenu( oMenu11 );  

	      }
	   
	   },
   
		onZoomIn : function() {
			this.byId("vbi").zoomToGeoPosition(10,51,5);
		},
   
   
	   //var oPanel = null;
	   onCloseDetail: function (evt) 
	   {
	      //alert("onCloseDetail" + this);
	   },

	   onOpenDetail: function (evt) 
	   {
	      var cont = document.getElementById(evt.getParameter("contentarea").id);
	      cont.innerHTML = "Content for Areas";
	      cont.style.color = "Blue";      

	   }
   
   
   
	});

	

}, /* bExport= */ true);
