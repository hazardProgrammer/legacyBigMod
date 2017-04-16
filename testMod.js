//Current version: v1.0
//v1.0: Created mod
G.AddData({
name:'Bread',
author:'Hazard',
desc:'A simple mod that adds bread and related items. Currently uses wrong sprites.',
engineVersion:1,
manifest:'breadManifest.js',
requires:['Default dataset*'],
sheets:{'spicySheet':'http:i.imgur.com/owlnODu.png'},//note: this is not my stylesheet. I ripped it from packerfan2016.
func:function()
{
	//The idea in this simple mod is to add a few elements focused around bread, because bread is very important.
	
	//First we create a couple new resources :
	new G.Res({
		name:'grain',
		desc:'[grain] is a very hard, unforgiving food when eaten raw. You need a very powerful jaw.',
		icon:[1,4,'spicySheet'],
		turnToByContext:{'eat':{'health':0.01,'happiness':0.01},'decay':{'spoiled food':0.75}},//this basically translates to : "when eaten, generate some health and happiness; when rotting, turn into either nothing or some spoiled food"
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'flour',
		desc:'Made from crushed [grain], made by [artistan]s. While not hard, it\'\s very dry.',
		icon:[2,4,'spicySheet'],
		turnToByContext:{'eat':{'health':0.02,'happiness':0.05},'decay':{'flour':0.9,'spoiled food':0.05}},//that last part makes flour effectively have a 90% chance of simply not rotting (in effect, it decays into itself)
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'dough',
		desc:'Made from combining 1 [flour] and 1 [water], dough is no longer hard or dry."
		icon:[0,0,'spicySheet'],
		turnToByContext:{'eat':{'health':0.05,'happiness':0.08},'decay':{'dough':0.6,'flour':0.3,'spoiled food':0.05}},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'bread',
		desc:'A pleasant-smelling baked good, made by baking dough',
		icon:[0,4,'spicySheet'],
		tuntToByContext:{'eat':{'health':0.1,'happiness':0.25},'decay'{'bread':0.95,'spoiled food':0.04}},
		partOf:'food',
		category:'food',
	});
	
	//Then we augment the base data to incorporate our new resources :
		//adding grain as something that can be gathered from grass
	G.getDict('grass').res['gather']['grain']=3;
		//adding a new mode to artisans so they can make flour from grain
	G.getDict('artisan').modes['flour']={name:'Grind grain into flour',desc:'Turns 2 [grain] into 1 [flour]',req:{'grain processing':true},use:{'stone tools':1}};
	G.getDict('artisan').modes['dough']={name:'Makes dough out of flour',desc:'Combines [water] and [flour] to make dough',req:{'grain processing':true},use:{'stone tools':0}};
	G.getDict('firekeeper').modes['baking']={name:'Bakes bread, delicious bead',desc:'bakes [dough] into [bread]',req:{'baking':true},use:{'fire pit':1}};
		//adding a new effect to artisans that handles the actual grain preparing and is only active when the unit has the mode "flour"
	G.getDict('artisan').effects.push({type:'convert',from:{'grain':3,},into:{'flour':1},every:3,mode:'flour'});
	G.getDict('artisan').effects.push({type:'convert',from:{'flour':1,'water':1},into:{'dough':1},every:3,mode:'dough'});
	G.getDict('firekeeper').effects.push({type:'convert',from:{'dough':2},into:{'bread':1},every:4,mode:'baking'});
	
	//Then we add a new technology which is required by the artisans to gain access to the "hot sauce" mode :
	new G.Tech({
		name:'grain processing',
		desc:'@[artisan]s can now produce [flour] from [grain] and [dough] from [flour] and [water]//This special process paves the way for baked goods.',
		icon:[1,0,'spicySheet'],
		cost:{'insight':15},
		req:{'tool-making':true},
	});
	new G.Tech({
		name:'baking',
		desc'@[firekeeper]s can now produce [bread] from baking [dough]//Unfortunately, yeast doesn\'\t exist yet. Matzoh, anyone?',
		icon:[0,3,'spicySheet'],
		cost:{'insight':20},
		req:{"cooking":true,{'grain processing':true},
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