//Current version: v1.0
//v1.0: Created mod
G.AddData({
name:'Big mod',
author:'Hazard',
desc:'A BIG mod.',
engineVersion:1,
manifest:'https://cdn.rawgit.com/hazardProgrammer/legacyBigMod/c6223139/bigManifest.js',
requires:['Default dataset*'],
sheets:{'styleSheet':'http:i.imgur.com/owlnODu.png'},//temporary stylesheet
func:function()
{
	//The idea in this mod is to add a lot of stuff. This mod includes the bread mod.
	
	//First we create a couple new resources :
	new G.Res({
		name:'grain',
		desc:'[grain] is a very hard, unforgiving food when eaten raw. You need a very powerful jaw.',
		icon:[1,4,'styleSheet'],
		turnToByContext:{'eat':{'health':0.01,'happiness':0},'decay':{'spoiled food':0.75}},//this basically translates to : "when eaten, generate some health and happiness; when rotting, turn into either nothing or some spoiled food"
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'flour',
		desc:'Made from crushed [grain], made by [artistan]s. While not hard, it\'\s very dry.',
		icon:[2,4,'styleSheet'],
		turnToByContext:{'eat':{'health':0.01,'happiness':0.01},'decay':{'flour':0.9,'spoiled food':0.05}},//that last part makes flour effectively have a 90% chance of simply not rotting (in effect, it decays into itself)
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'bread',
		desc:'A pleasant-smelling baked good, made by baking flour',
		icon:[0,4,'styleSheet'],
		turnToByContext:{'eat':{'health':0.2,'happiness':0.5},'decay':{'bread':0.95,'spoiled food':0.04}},
		partOf:'food',
		category:'food',
	});
	//making -hic!- beer
	new G.Res({
		
	});
	
	//Then we augment the base data to incorporate our new resources :
		//adding grain as something that can be gathered from grass
	G.getDict('grass').res['gather']['grain']=3;
		//adding a new mode to artisans so they can make flour from grain
	G.getDict('artisan').modes['flour']={name:'Grind grain into flour',desc:'Turns 2 [grain] into 1 [flour]',req:{'grain processing':true},use:{'stone tools':1}};
	G.getDict('firekeeper').modes['baking']={name:'Bakes bread, delicious bead',desc:'bakes [grain] into [bread]',req:{'baking':true},use:{'fire pit':1}};
		//adding a new effect to artisans that handles the actual grain preparing and is only active when the unit has the mode "flour"
	G.getDict('artisan').effects.push({type:'convert',from:{'grain':3,},into:{'flour':1},every:3,mode:'flour'});
	G.getDict('firekeeper').effects.push({type:'convert',from:{'flour':2,'water':1},into:{'bread':1},every:4,mode:'baking'});
	
	//Then we add a new technology which is required by the artisans to gain access to the "hot sauce" mode :
	new G.Tech({
		name:'grinding',
		desc:'@[artisan]s can now produce [flour] from [grain].<br>This special process paves the way for baked goods.',
		icon:[1,0,'styleSheet'],
		cost:{'insight':15},
		req:{'tool-making':true},
	});
	new G.Tech({
		name:'baking',
		desc:'@[firekeeper]s can now produce [bread] from baking [flour].<br>Unfortunately, yeast doesn\'\t exist yet. Matzoh, anyone?',
		icon:[0,3,'styleSheet'],
		cost:{'insight':20},
		req:{"cooking":true,'grinding':true},
	});
	
	new G.Policy({
		name:'eat herbs',
		desc:'Your people will eat or not eat [herb]s.<br> <i>To eat or not to eat, that is the question.<i>',
		icon:[6,12,4,6],
		cost:{'influence':1},
		startMode:'on',
		req:{'rules of food':true},
		effects:[
			{type:'make part of',what:['herb'],parent:'food'},
		],
		effectsOff:[
			{type:'make part of',what:['herb'],parent:''},
		],
		category:'food',
	});
	//Finally, we add a trait that amplifies the benefits of consuming hot sauce; it will take on average 20 years to appear once the conditions (knowing the "Hot sauce preparing" tech) is fulfilled.
	/*new G.Trait({
		name:'hot sauce madness',
		desc:'@your people appreciate [hot sauce] twice as much and will be twice as happy from consuming it.',
		icon:[1,1,'spicySheet'],
		chance:20,
		req:{'hot sauce preparing':true},
		effects:[
			{type:'function',func:function(){G.getDict('hot sauce').turnToByContext['eat']['happiness']=0.2;}},//this is a custom function executed when we gain the trait
		],
	});*/
	//temporarily not needed: kept for future reference.
	
	//There are many other ways of adding and changing content; refer to /data.js, the default dataset, if you want to see how everything is done in the base game. Good luck!
}
});
