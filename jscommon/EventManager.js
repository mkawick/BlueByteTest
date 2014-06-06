/**
* EventManager class that acts as a message broker for inter-application communication
* @class EventManager
* @augments CorePlugin
* @returns EventManager public interface
*/
function EventManager ()
{
	var _this = this;

	var _channels = new Object();// this will become the 'map' or assoc array

	/**
	* EventManager Initialization function. This registers the plugin with the {@link Core}
	* @constructs
	*/
	function _init( )
	{
	};

	/**
	* Create a named Channel
	* @param {String} channelName Name of channel to create
	*/
	function _createChannel( channelName )
	{
		if(channelName && !_channelExists(channelName))
		{
			_channels[channelName] = new Object;
			_channels[channelName].subscribers = new Array;

			// TODO: Potentially support "unnamed" subscribers
			//channels[channelName].subscribers['unnamed'] = {};
			return true;
		}
		else
		{
			return false;
		}
	};

	/**
	* Deletes a named Channel
	* @param {String} channelName Name of channel to delete
	*/
	function _deleteChannel( channelName )
	{
		if( channelName && _channelExists(channelName) == true )
		{
			// Remove subscribers
			if(_hasSubscribers(channelName))
			{
				for(var x = 0; x < _channels[channelName].subscribers.length; x++)
				{
					removeEventListener(channelName,_channels[channelName].subscribers[x].callback);
				}
			}
			if( _channels[channelName].domSenders )// these are callbacks waiting to happen
			{
				_channels[channelName].markForDelete = true;
				return true;
			}

			delete _channels[channelName];

			return true;
		}
		else
		{
			return false;
		}
	};

	/**
	* Checks to see if a Channel exists
	* @param {String} channelName Name of channel to look for
	*/
	function _channelExists( channelName )
	{
		return (_channels[channelName]) ? true : false;
	};

	/**
	* Checks to see if a specific Channel has ANY subscribers
	* @param {String} channelName Name of channel to look for
	*/
	function _hasSubscribers( channelName )
	{
		if (_channels[channelName].subscribers.length > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	};

	/**
	* Checks to see if a specific Channel has a named subscriber
	* @param {String} channelName Name of channel to look for
	* @param {String} subscriberName Name of subscriber to look for
	*/
	function _hasNamedSubscriber( channelName, subscriberName )
	{
		if( _hasSubscribers(channelName) )
		{
			for( var x = 0; x < _channels[channelName].subscribers.length; x++ )
			{
				if( _channels[channelName].subscribers[x].name === subscriberName )
				{
					return true;
				}
			}
		}
		return false;
	};

	/**
	* Subscribe to a named Channel
	* @param {String} channelName Name of channel to subscribe to
	* @param {String} callBack Function to execute when subscription is complete
	* @param {String} channelName Name of channel to which we subscribe
	*/
	function _subscribe( channelName, subscriberName, callBack, contextObj )
	{
		_createChannel( channelName );

		if( channelName && callBack && !_hasNamedSubscriber( channelName, subscriberName ) )
		{
			var setup  =  
				{
					name: subscriberName,
					callback: callBack,
					isAggregated: false
				};
				if( contextObj )
					setup.context = contextObj.context;
				
			_channels[channelName].subscribers.push( setup );
			
			game.logger.log('[core.eventMgr] Subscriber ' + subscriberName + ' listening on channel '+ channelName, 2);
			return true;
		}
		else
		{
			return false;
		}
	};


	/** 
	* Publish to a named Channel
	* @param {String} channelName Name of channel to publish to
	* @param {array} data
	* @param {json, optional} options
		* @param {int} timeout before sending
		* @param {bool} do not send for a period of time treating multiple events as one before sending
	*	OPTIONS{
	*	timeout: 0, 
	*	shouldAggregateMultipleRequests: false,
	*	};
	*/
	function _publish( channelName, data, options )
	{
		if( channelName )
		{
			_createChannel( channelName );

			if( options === undefined || options.timeout === undefined || options.timeout < 1 )
			{
				_sendPublishedEvent( {name:channelName, data:data} );
			}
			else // timeouts are required
			{
				if( options && options.shouldAggregateMultipleRequests === true && _channels[channelName].isAggregated === true )
				{ 
					return;
				}
				
				setTimeout( _sendPublishedEvent, options.timeout, {name:channelName, data:data} );
				
				if( options && options.shouldAggregateMultipleRequests === true )
				{
					_channels[channelName].isAggregated = true;
				}
			}

			return true;
		}
	};
	
	/** 
	* Publish to a named Channel immediately
	* @param {String} channelName Name of channel to publish to
	* @param {array} data
	*/
	function _sendPublishedEvent( jsonObj )
	{
		var channelName = jsonObj.name, data = jsonObj.data;
		var channel = _channels[channelName];
		var subscribers = channel.subscribers;
		var num_subscribers = subscribers.length;	
		
		channel.isAggregated = false;// clear aggregated flag
		
		game.logger.log('[core.eventMgr] Publishing to '+num_subscribers+' subscribers on channel '+ channelName, 2);
		for( i=0;i<num_subscribers;i++ )
		{
			game.logger.log('[core.eventMgr] --- Published to ' + subscribers[i].name, 2);
			subscribers[i].callback( data, subscribers[i].context );
		}
		jsonObj = null;// free the extra RAM
	};


	/**
	* Unsubscribe from a named Channel
	* @param {String} channelName Name of channel to unsubscribe from
	*/
	function _unsubscribe( channelName, subscriberName )
	{
		if(channelName && _channelExists(channelName) && _hasSubscribers(channelName))
		{
			for (var x = 0; x < _channels[channelName].subscribers.length; x++)
			{
				if (_channels[channelName].subscribers[x].name === subscriberName)
				{
					removeEventListener(channelName,_channels[channelName].subscribers[x].callBack);

					_channels[channelName].subscribers[x].cleanup();
					_channels[channelName].subscribers.splice(x,1);

					return true;
				}
			}
		}
		else
		{
			return false;
		}
	};
	
	//------------------------------------------------------

	/**
	* Public interface for EventManager class
	*/
	this.init = _init;
	this.toString = function(){ return "[Object EventManager]"; };
	this.createChannel = _createChannel;
	this.deleteChannel = _deleteChannel;
	this.channelExists = _channelExists;
	this.hasSubscribers = _hasSubscribers;
	this.subscribe = _subscribe;
	this.publish = _publish;
	this.unsubscribe = _unsubscribe;
	this.getChannels = function() {return _channels;}
}