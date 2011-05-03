/*
 * Copyright 2006 Philip Taylor
 * <philip at zaynar.demon.co.uk> / <excors at gmail.com>
 * Distributed under the terms of the GPL (http://www.gnu.org/licenses/gpl.txt)
 */

var ui_enabled = true;

(function(){
	
var ui_doc;

function init()
{
	// (nothing to do here any more)
}

function find_ui_doc()
{
	if (! ui_doc)
	{
		var ui = $('uibottom');
		if (ui)
		{
			ui_doc = ui.contentDocument;
		}
	}
}

function set_counter(value)
{
	try
	{
		find_ui_doc();
		if (ui_doc)
		{
			ui_doc.getElementById('counter_0').setAttribute('transform', 'translate(0, '+(-80*Math.floor(value/10))+')');
			ui_doc.getElementById('counter_1').setAttribute('transform', 'translate(0, '+(-80*Math.floor(value%10))+')');
			ui_doc.documentElement.forceRedraw();
		}
	}
	catch (e)
	{
	}
}

// Export function interface
this.ui =
{
	init: init,
	set_counter: set_counter
};

})();
