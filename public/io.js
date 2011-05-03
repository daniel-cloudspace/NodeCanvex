/*
 * Copyright 2006 Philip Taylor
 * <philip at zaynar.demon.co.uk> / <excors at gmail.com>
 * Distributed under the terms of the GPL (http://www.gnu.org/licenses/gpl.txt)
 */

// When the file store is a different domain to this code, we have to ask
// the user for privileges to access it. (Only works in Mozilla.)
const request_http_privilege = true;

const http_filestore_domain = 'zaynar.demon.co.uk';
const http_filestore = 'http://zaynar.demon.co.uk/misc2/doomcanvas/cgi-bin/filestore.cgi';
const http_filestore_xdm = 'http://zaynar.demon.co.uk/misc2/doomcanvas/filestore_xdm.html';
//const http_filestore_xdm = 'filestore_xdm.html';


function save_to_file_store(name, data)
{
	try
	{
		if (request_http_privilege)
		{
			netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
		}

		var json = toJSONString(data);
		
		var req = new XMLHttpRequest();
		req.open('POST', http_filestore + '?action=save&name='+escape(name), false);
		req.send(json);
		return true;
	}
	catch (e)
	{
		alert(e);
		return false;
	}
}

function load_from_file_store(name)
{
	try
	{
		if (request_http_privilege)
		{
			netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
		}

		var req = new XMLHttpRequest();
		req.open('GET', http_filestore + '?action=load&name='+escape(name), false);
		req.send(null);
		var res = parseJSON(req.responseText);
		if (res)
		{
			return parseJSON(res.data);
		}
		else
		{
			return null;
		}
	}
	catch (e)
	{
		alert(e);
		return null;
	}
}

function load_from_file_store_async_xmlhttp(name, handler)
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function ()
	{
		if (req.readyState == 4)
		{
			var res = parseJSON(req.responseText);
			if (res)
			{
				handler(parseJSON(res.data));
			}
			else
			{
				handler();
			}
		}
	};
	req.open('GET', http_filestore + '?action=load&name='+escape(name), true);
	req.send(null);
}

function load_from_file_store_async(name, handler)
{
	// Bug: gets confused if there are multiple async requests at once

	// First attempt to use normal XMLHttpRequest, hoping that we're
	// on the same domain.
	// If that fails, try cross-document messaging (which works in Opera).
	// If that fails, try asking the user for special permission (in Mozilla).
	// If that fails, give up.

	// Normal XMLHttpRequest:
	try
	{
		if (document.domain == http_filestore_domain)
		{
			load_from_file_store_async_xmlhttp(name, handler);
			return true;
		}
	}
	catch (e)
	{
		alert(e);
	}

	// Cross-document messaging:
	try
	{
		if (document.postMessage)
		{
			var obj = $('xdm_object');

			function on_message(e)
			{
				// Check that the message came from our XDM document
				if (e.source == obj.contentDocument)
				{
					// Remove the currently-invoked event listener
					document.removeEventListener('message', on_message, false);

					// Handle the received message
					var res = parseJSON(e.data);
					if (res.error)
					{
						alert('Failed to retrieve map data: ' + unescape(res.error));
						handler();
					}
					else
					{
						handler(parseJSON(res.data));
					}
				}
			}

			document.addEventListener('message', on_message, false);

			// If the XDM object doesn't exist, create it now
			if (! obj)
			{
				obj = document.createElementNS('http://www.w3.org/1999/xhtml', 'object');
				obj.id = 'xdm_object';
				$('xdm_container').appendChild(obj);

				obj.addEventListener('load', function ()
					{
						obj.contentDocument.postMessage(name);
					}, false);

				obj.data = http_filestore_xdm;
			}
			else
			{
				// If the object exists, and it has loaded its document, just send it a message
				if (obj.contentDocument && obj.contentDocument.postMessage)
				{
					obj.contentDocument.postMessage(name);
				}
				else
				{
					// It's not yet loaded, and we don't really know when it will be.
					// If we try registering a 'load' handler, we might do it too
					// late because the document could load asynchronously before we've
					// managed to add the handler, and it gets all messy.
					// So just try it again in 100msec.
					setTimeout(load_from_file_store_async, 100, name, handler);
				}
			}

			return true;
		}
	}
	catch (e)
	{
		alert(e);
	}

	// Mozilla elevated privileges, which works if we're running from a local file
	try
	{
		if (request_http_privilege && (document.domain === '' || document.domain == 'localhost'))
		{
			netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
			load_from_file_store_async_xmlhttp(name, handler);
			return true;
		}
	}
	catch (e)
	{
	}

	return false;
}

// Local files are stored in $Home/.canvex/

function read_local_file(name)
{
	if (name.match(/[^a-zA-Z0-9_\.]/) || name.match(/^\./))
	{
		alert("Invalid filename - must only contain alphanumerics, '_' and '.'; and must not start with '.'");
		return null;
	}
	
	try
	{
		netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		
		var file = Components.classes['@mozilla.org/file/directory_service;1'].
		                      getService(Components.interfaces.nsIProperties).
		                      get('Home', Components.interfaces.nsIFile);
		file.append('.canvex');
		file.append(name);
	
		// File input stream	
		var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].
		                         createInstance(Components.interfaces.nsIFileInputStream);
	
		// Unicode input stream
		var istream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
		                         createInstance(Components.interfaces.nsIConverterInputStream);
	
		const replacementChar = Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER;
	
		fstream.init(file, -1, 0, 0);
		istream.init(fstream, "UTF-8", 1024, replacementChar);
		
		// Read file's contents
		var str = {};
		var contents = '';
		while (istream.readString(4096, str) !== 0)
		{
			contents += str.value;
		}
	
		istream.close();
		fstream.close();

		return parseJSON(contents);
	}
	catch (e)
	{
		if (e.name == 'NS_ERROR_FILE_NOT_FOUND')
		{
			alert('Cannot find file named "' + name + '"');
		}
		else
		{
			alert('Unexpected error: ' + e);
		}
		return null;
	}
}

function write_local_file(name, contents)
{
	if (name.match(/[^a-zA-Z0-9_\.]/) || name.match(/^\./))
	{
		alert("Invalid filename - must only contain alphanumerics, '_' and '.'; and must not start with '.'");
		return false;
	}
	
	try
	{
		var json = toJSONString(contents);

		netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		
		var file = Components.classes['@mozilla.org/file/directory_service;1'].
		                      getService(Components.interfaces.nsIProperties).
		                      get('Home', Components.interfaces.nsIFile);
		file.append('.canvex');
		
		// Create .canvex dir if it doesn't exist
		if (! file.exists())
		{
			file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 436); // 436==0664 (ECMAScript standard doesn't allow octal)
		}
		
		file.append(name);
	
		// File output stream	
		var fstream = Components.classes["@mozilla.org/network/file-output-stream;1"].
		                         createInstance(Components.interfaces.nsIFileOutputStream);
	
		// Unicode output stream
		var ostream = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
		                         createInstance(Components.interfaces.nsIConverterOutputStream);
	
		fstream.init(file, 0x02|0x08|0x20, 436, 0); // truncate on creation ; 436==0664
		ostream.init(fstream, "UTF-8", 1024, 0x0000);
		
		ostream.writeString(json);
	
		ostream.close();
		fstream.close();
		
		return true;
	}
	catch (e)
	{
		alert('Unexpected error: ' + e);
		return false;
	}
}

//alert(read_local_file('test'));
//write_local_file('test', 'Test');
