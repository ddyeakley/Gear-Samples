/*
  * Copyright (c) 2014 Samsung Electronics Co., Ltd
  *
  * Licensed under the Flora License, Version 1.1 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://floralicense.org/license/
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

var WebHelperClient = {
	/**
	  * @brief Initialize WebHelperClient object with registering a handler object.
	  *
	  * This is the function that initializes the WebHelperClient object.
	  * Before using the functionalities of WebHelperClient, make sure to call this function
	  * with passing the handler object as its parameter, which implements callback functions
	  * that needs to be handled by the IME.
	  *
	  * @param handler The handler object implementing "on*" callback functions
	  *
	  * @code
	  * var WebHelperClientHandler = {
	  * 	onInit : function () {
	  * 		// Do what you want when your IME gets the INIT message
	  * 	}
	  * };
	  * WebHelperClient.initialize(WebHelperClientHandler);
	  * @endcode
	  */
	initialize : function (handler) {
		this.handler = handler;
		if (this.impl === null) {
			this.impl = new this.WebHelperClientInternal(this);
		}
	},

	/** IME to ISF requests
	  * The functions below, are used for sending request messages to the ISF.
	  */

	/**
	  * @brief Leave a dlog message.
	  *
	  * @param str The log message to display
	  */
	log : function(str) {
		this.impl.log(str);
	},

	/**
	  * @brief Commit a UTF-8 String to client application directly.
	  *
	  * @param str The byte array of UTF-8 string to be committed.
	  */
	commitString : function(str) {
		this.impl.commitString(str);
	},
	/**
	  * @brief Update a new UTF-8 string for preedit.
	  *
	  * @param str The byte array of UTF-8 string to be updated.
	  */
	updatePreeditString : function(str) {
		this.impl.updatePreeditString(str);
	},
	/**
	  * @brief Send a KeyEvent to an client application.
	  *
	  * @param code The KeyEvent to be sent.
	  */
	sendKeyEvent : function(code) {
		this.impl.sendKeyEvent(code);
	},
	/**
	  * @brief Forward a KeyEvent to client application directly, without translation by Keyboard Engine.
	  *
	  * The difference between the sendKeyEvent and forwardKeyEvent is that the key event
	  * sent via forwardKeyEvent function will not be translated by Keyboard Engine and
	  * will be delivered as it is.
	  *
	  * @param code The KeyEvent to be forwarded.
	  */
	forwardKeyEvent : function(code) {
		this.impl.forwardKeyEvent(code);
	},
	/**
	  * @brief Updates the keyboard window's geometry information
	  *
	  * @param portraitWidth The width of keyboard, when in portrait mode
	  * @param portraitHeight The height of keyboard, when in portrait mode
	  * @param landscapeWidth The width of keyboard, when in landscape mode
	  * @param landscapeHeight The height of keyboard, when in landscape mode
	  */
	setKeyboardSizes : function(portraitWidth, portraitHeight, landscapeWidth, landscapeHeight) {
		this.impl.setKeyboardSizes(portraitWidth, portraitHeight, landscapeWidth, landscapeHeight);
	},

	/** ISF to IME notifications
	  * The functions below, are called when IME needs to be notified.
	  * You can implement these functions in a handler object and pass it to
	  * initialize() function so that your handler functions can be called on each events.
	  */

	/**
	  * @brief Handler on initialization signal.
	  *
	  * This signal is used to notify that the WebIME framework finished initializing.
	  */
	onInit : function() {
		if (typeof this.handler.onInit === 'function') {
			this.handler.onInit();
		}
	},
	/**
	  * @brief Handler on exit signal.
	  *
	  * This signal is used to notify that this WebIME is about to be terminated.
	  */
	onExit : function() {
		if (typeof this.handler.onExit === 'function') {
			this.handler.onExit();
		}
	},
	/**
	  * @brief Handler on focus in signal.
	  *
	  * This signal is used to do something when input context is focused in.
	  *
	  * @param inputContext The handle of the client Input Context that sent this event
	  */
	onFocusIn : function(inputContext) {
		if (typeof this.handler.onFocusIn === 'function') {
			this.handler.onFocusIn(inputContext);
		}
	},
	/**
	  * @brief Handler on focus out signal.
	  *
	  * This signal is used to do something when input context is focused out.
	  *
	  * @param inputContext The handle of the client Input Context that sent this event
	  */
	onFocusOut : function(inputContext) {
		if (typeof this.handler.onFocusOut === 'function') {
			this.handler.onFocusOut(inputContext);
		}
	},

	/**
	  * @brief Handler on show signal.
	  *
	  * This signal is used to show keyboard.
	  *
	  * @param inputContext The handle of the client Input Context that sent this event
	  */
	onShow : function(inputContext) {
		if (typeof this.handler.onShow === 'function') {
			this.handler.onShow(inputContext);
		}
	},
	/**
	  * @brief Handler on hide signal.
	  *
	  * This signal is used to hide keyboard.
	  *
	  * @param inputContext The handle of the client Input Context that sent this event
	  */
	onHide : function(inputContext) {
		if (typeof this.handler.onHide === 'function') {
			this.handler.onHide(inputContext);
		}
	},

	/**
	  * @brief Handler on rotation signal.
	  *
	  * This signal is used to notify that the keyboard is being rotated.
	  *
	  * @param degree The angle that this keyboard is being rotated to
	  */
	onSetRotation : function(degree) {
		if (typeof this.handler.onSetRotation === 'function') {
			this.handler.onSetRotation(degree);
		}
	},

	/**
	  * @brief Handler on update cursor position signal.
	  *
	  * This signal is used to let the keyboard get the cursor position information.
	  *
	  * @param inputContext The handle of the client Input Context that sent this event
	  * @param position The cursor position
	  */
	onUpdateCursorPosition : function(inputContext, position) {
		if (typeof this.handler.onUpdateCursorPosition === 'function') {
			this.handler.onUpdateCursorPosition(inputContext, position);
		}
	},

	/**
	  * @brief Handler on set language signal.
	  *
	  * This signal is used to set input language.
	  *
	  * @param language The language to be set
	  */
	onSetLanguage : function(language) {
		if (typeof this.handler.onSetLanguage === 'function') {
			this.handler.onSetLanguage(language);
		}
	},

	/**
	  * @brief Handler on set im data signal.
	  *
	  * This signal is used to send im data to keyboard.
	  *
	  * @param imdata The imdata to be set
	  */
	onSetImdata : function(imdata) {
		if (typeof this.handler.onSetImdata === 'function') {
			this.handler.onSetImdata(imdata);
		}
	},
	/**
	  * @brief Handler on get im data signal.
	  *
	  * This signal is used to get im data from keyboard.
	  *
      * @return the current imdata value
	  */
	onGetImdata : function() {
		var imdata = "";
		if (typeof this.handler.onGetImdata === 'function') {
			imdata = this.handler.onGetImdata();
		}
		this.impl.replyGetImdata(imdata);
	},

	/**
	  * @brief Handler on set return key type signal.
	  *
	  * This signal is used to set return key type to keyboard.
	  *
	  * @param type The type of return key to be set, among the following values
	  *             "default", "done", "go", "join", "login",
	  *             "next", "search", "send", "signin"
	  */
	onSetReturnKeyType : function(type) {
		if (typeof this.handler.onSetReturnKeyType === 'function') {
			this.handler.onSetReturnKeyType(type);
		}
	},
	/**
	  * @brief Handler on get return key type signal.
	  *
	  * This signal is used to get return key type from keyboard.
	  *
	  * @return the current return key type value
	  */
	onGetReturnKeyType : function() {
		if (typeof this.handler.onGetReturnKeyType === 'function') {
			this.handler.onGetReturnKeyType();
		}
	},

	/**
	  * @brief Handler on set return key disable signal.
	  *
	  * This signal is used to set return key disabled state to keyboard.
	  *
	  * @param disabled The value that indicates whether the return key should be disabled or not
	  */
	onSetReturnKeyDisable : function(disabled) {
		if (typeof this.handler.onSetReturnKeyDisable === 'function') {
			this.handler.onSetReturnKeyDisable(disabled);
		}
	},
	/**
	  * @brief Handler on get return key disable signal.
	  *
	  * This signal is used to get return key disabled state from keyboard.
	  *
	  * @return the current return key disabled state value
	  */
	onGetReturnKeyDisable : function() {
		if (typeof this.handler.onGetReturnKeyDisable === 'function') {
			this.handler.onGetReturnKeyDisable();
		}
	},

	/**
	  * @brief Handler on set virtual keyboard layout signal.
	  *
	  * This signal is used to set virtual keyboard layout, among the following values.
	  *
	  * @param layout The virtual keyboard layout value to be set,
	  *             "normal", "number", "email", "url", "phonenumber",
	  *             "ip", "month", "numberonly", "password", "datetime"
	  */
	onSetLayout : function(layout) {
		if (typeof this.handler.onSetLayout === 'function') {
			this.handler.onSetLayout(layout);
		}
	},
	/**
	  * @brief Handler on get virtual keyboard layout signal.
	  *
	  * This signal is used to get virtual keyboard layout.
	  *
	  * @return the current virtual keyboard layout value
	  */
	onGetLayout : function() {
		if (typeof this.handler.onGetLayout === 'function') {
			this.handler.onGetLayout();
		}
	},

	/**
	  * @brief Handler on reset input context signal.
	  *
	  * This signal is used to reset keyboard input context.
	  *
	  * @param inputContext The handle of the client Input Context that sent this event
	  */
	onResetInputContext : function(inputContext) {
		if (typeof this.handler.onResetInputContext === 'function') {
			this.handler.onResetInputContext(inputContext);
		}
	},

	/**
	  * @brief Handler on process key event signal.
	  *
	  * @param code The key code of current key event
	  * @param mask The key's modifier mask of current key event
	  * @param layout The hardware keyboard layout identifier
	  *
      * @return true if the event is processed, otherwise it will be forwarded to client application
	  */
	onProcessKeyEvent : function(code, mask, layout) {
		var processed = false;
		if (typeof this.handler.onProcessKeyEvent === 'function') {
			processed = this.handler.onProcessKeyEvent(code, mask, layout);
		}
		this.impl.replyProcessKeyEvent(processed);
	},

	/* Keycode enumeration values used when invoking sendKeyEvent() or forwardKeyEvent() functions */
	Keycode : {
		BACKSPACE:0xff08,
		TAB:0xff09,
		RETURN:0xff0d,
		ESCAPE:0xff1b,
		DELETE:0xffff,
		HOME:0xff50,
		LEFT:0xff51,
		UP:0XFf52,
		RIGHT:0xff53,
		DOWN:0xff54,
		PRIOR:0xff55,
		PAGE_UP:0xff55,
		NEXT:0xff56,
		PAGE_DOWN:0xff56,
		END:0Xff57,
		INSERT:0xff63,
		KP_SPACE:0xff80,
		KP_TAB:0xff89,
		KP_ENTER:0xff8d,
		KP_F1:0xff91,
		KP_F2:0xff92,
		KP_F3:0xff93,
		KP_F4:0xff94,
		KP_HOME:0xff95,
		KP_LEFT:0xff96,
		KP_UP:0xff97,
		KP_RIGHT:0xff98,
		KP_DOWN:0xff99,
		KP_PRIOR:0xff9a,
		KP_PAGE_UP:0xff9a,
		KP_NEXT:0xff9b,
		KP_PAGE_DOWN:0xff9b,
		KP_END:0xff9c,
		KP_BEGIN:0xff9d,
		KP_INSERT:0xff9e,
		KP_DELETE:0xff9f,
		KP_EQUAL:0xffbd,
		KP_MULTIPLY:0xffaa,
		KP_ADD:0xffab,
		KP_SEPARATOR:0xffac,
		KP_SUBTRACT:0xffad,
		KP_DECIMAL:0xffae,
		KP_DIVIDE:0xffaf,
		KP_0:0xffb0,
		KP_1:0xffb1,
		KP_2:0xffb2,
		KP_3:0xffb3,
		KP_4:0xffb4,
		KP_5:0xffb5,
		KP_6:0xffb6,
		KP_7:0xffb7,
		KP_8:0xffb8,
		KP_9:0xffb9,
		F1:0xffbe,
		F2:0xffbf,
		F3:0xffc0,
		F4:0xffc1,
		F5:0xffc2,
		F6:0xffc3,
		F7:0xffc4,
		F8:0xffc5,
		F9:0xffc6,
		F10:0xffc7,
		F11:0xffc8,
		F12:0xffc9,
		SHIFT_L:0xffe1,
		SHIFT_R:0xffe2,
		CONTROL_L:0xffe3,
		CONTROL_R:0xffe4,
		CAPS_LOCK:0xffe5,
		SHIFT_LOCK:0xffe6,
		META_L:0xffe7,
		META_R:0xffe8,
		ALT_L:0xffe9,
		ALT_R:0xffea,
		SUPER_L:0xffeb,
		SUPER_R:0xffec,
		HYPER_L:0xffed,
		HYPER_R:0xffee,
		SPACE:0x020,
		EXCLAM:0x021,
		QUOTEDBL:0x022,
		NUMBERSIGN:0x023,
		DOLLAR:0x024,
		PERCENT:0x025,
		AMPERSAND:0x026,
		APOSTROPHE:0x027,
		QUOTERIGHT:0x027,
		PARENLEFT:0x028,
		PARENRIGHT:0x029,
		ASTERISK:0x02a,
		PLUS:0x02b,
		COMMA:0x02c,
		MINUS:0x02d,
		PERIOD:0x02e,
		SLASH:0x02f,
		0:0X030,
		1:0X031,
		2:0X032,
		3:0X033,
		4:0X034,
		5:0X035,
		6:0X036,
		7:0X037,
		8:0X038,
		9:0X039,
		COLON:0x03a,
		SEMICOLON:0x03b,
		LESS:0x03c,
		EQUAL:0x03d,
		GREATER:0x03e,
		QUESTION:0x03f,
		AT:0x040,
		A:0X041,
		B:0X042,
		C:0X043,
		D:0X044,
		E:0X045,
		F:0X046,
		G:0X047,
		H:0X048,
		I:0x049,
		J:0x04a,
		K:0x04b,
		L:0x04c,
		M:0x04d,
		N:0x04e,
		O:0x04f,
		P:0x050,
		Q:0x051,
		R:0x052,
		S:0x053,
		T:0x054,
		U:0x055,
		V:0x056,
		W:0x057,
		X:0x058,
		Y:0x059,
		Z:0x05a,
		BRACKETLEFT:0x05b,
		BACKSLASH:0x05c,
		BRACKETRIGHT:0x05d,
		ASCIICIRCUM:0x05e,
		UNDERSCORE:0x05f,
		GRAVE:0x060,
		QUOTELEFT:0x060,
		a:0x061,
		b:0x062,
		c:0x063,
		d:0x064,
		e:0x065,
		f:0x066,
		g:0x067,
		h:0x068,
		i:0x069,
		j:0x06a,
		k:0x06b,
		l:0x06c,
		m:0x06d,
		n:0x06e,
		o:0x06f,
		p:0x070,
		q:0x071,
		r:0x072,
		s:0x073,
		t:0x074,
		u:0x075,
		v:0x076,
		w:0x077,
		x:0x078,
		y:0x079,
		z:0x07a,
		BRACELEFT:0x07b,
		BAR:0x07c,
		BRACERIGHT:0x07d,
		ASCIITILDE:0x07e
	},

	/* The code below is only for internal implementation and not for keyboard developers */
	impl : null,
	handler : null,
	WebHelperClientInternal: function (client) {
		this.CLIENT_VERSION = "1.11";

		this.MessageTypes = {
			PLAIN:"plain",
			QUERY:"query",
			REPLY:"reply"
		};

		this.MessageCommands = {
			INIT:"init",
			EXIT:"exit",

			FOCUS_IN:"focus_in",
			FOCUS_OUT:"focus_out",
			SHOW:"show",
			HIDE:"hide",
			SET_ROTATION:"set_rotation",
			UPDATE_CURSOR_POSITION:"update_cursor_position",
			SET_LANGUAGE:"set_language",
			SET_IMDATA:"set_imdata",
			GET_IMDATA:"get_imdata",
			SET_RETURN_KEY_TYPE:"set_return_key_type",
			GET_RETURN_KEY_TYPE:"get_return_key_type",
			SET_RETURN_KEY_DISABLE:"set_return_key_disable",
			GET_RETURN_KEY_DISABLE:"get_return_key_disable",
			SET_LAYOUT:"set_layout",
			GET_LAYOUT:"get_layout",
			RESET_INPUT_CONTEXT:"reset_input_context",
			PROCESS_KEY_EVENT:"process_key_event",

			LOG:"log",
			COMMIT_STRING:"commit_string",
			UPDATE_PREEDIT_STRING:"update_preedit_string",
			SEND_KEY_EVENT:"send_key_event",
			FORWARD_KEY_EVENT:"forward_key_event",
			SET_KEYBOARD_SIZES:"set_keyboard_sizes",
			LOGIN:"login"
		};

		this.log = function(str) {
			if (this.socket !== "undefined") {
				this.socket.send(
					this.MessageTypes.PLAIN + " " +
					this.MessageCommands.LOG + " " +
					str);
			}
		};
		this.commitString = function(str) {
			if (this.socket !== "undefined") {
				this.socket.send(
					this.MessageTypes.PLAIN + " " +
					this.MessageCommands.COMMIT_STRING + " " +
					str);
			}
		};
		this.updatePreeditString = function(str) {
			if (this.socket !== "undefined") {
				this.socket.send(
					this.MessageTypes.PLAIN + " " +
					this.MessageCommands.UPDATE_PREEDIT_STRING + " " +
					str);
			}
		};
		this.sendKeyEvent = function(code) {
			if (this.socket !== "undefined") {
				this.socket.send(
					this.MessageTypes.PLAIN + " " +
					this.MessageCommands.SEND_KEY_EVENT + " " +
					code);
			}
		};
		this.forwardKeyEvent = function(code) {
			if (this.socket !== "undefined") {
				this.socket.send(
					this.MessageTypes.PLAIN + " " +
					this.MessageCommands.FORWARD_KEY_EVENT + " " +
					code);
			}
		};
		this.setKeyboardSizes = function(portraitWidth, portraitHeight, landscapeWidth, landscapeHeight) {
			if (this.socket !== "undefined") {
				this.socket.send(
					this.MessageTypes.PLAIN + " " +
					this.MessageCommands.SET_KEYBOARD_SIZES + " " +
					portraitWidth + " " + portraitHeight + " " +
					landscapeWidth + " " + landscapeHeight);
			}
		};
		this.replyGetImdata = function(data) {
			if (this.socket !== "undefined") {
				this.socket.send(
					this.MessageTypes.REPLY + " " +
					this.MessageCommands.GET_IMDATA + " " +
					data);
			}
		};
		this.replyProcessKeyEvent = function(ret) {
			if (this.socket !== "undefined") {
				this.socket.send(
					this.MessageTypes.REPLY + " " +
					this.MessageCommands.PROCESS_KEY_EVENT + " " +
					ret);
			}
		};
		this.defaultHandler = function (items) {
			if (items[1] === this.MessageCommands.INIT) {
				client.onInit();
			}
			if (items[1] === this.MessageCommands.EXIT) {
				client.onExit();
			}
			if (items[1] === this.MessageCommands.FOCUS_IN) {
				client.onFocusIn(items[2]);
			}
			if (items[1] === this.MessageCommands.FOCUS_OUT) {
				client.onFocusOut(items[2]);
			}

			if (items[1] === this.MessageCommands.SHOW) {
				client.onShow(items[2]);
			}
			if (items[1] === this.MessageCommands.HIDE) {
				client.onHide(items[2]);
			}

			if (items[1] === this.MessageCommands.SET_ROTATION) {
				client.onSetRotation(items[2]);
			}

			if (items[1] === this.MessageCommands.UPDATE_CURSOR_POSITION) {
				client.onUpdateCursorPosition(items[2], items[3]);
			}

			if (items[1] === this.MessageCommands.SET_LANGUAGE) {
				client.onSetLanguage(items[2]);
			}

			if (items[1] === this.MessageCommands.SET_IMDATA) {
				client.onSetImdata(items[2], items[3]);
			}
			if (items[1] === this.MessageCommands.GET_IMDATA) {
				client.onGetImdata();
			}

			if (items[1] === this.MessageCommands.SET_RETURN_KEY_TYPE) {
				client.onSetReturnKeyType(items[2]);
			}
			if (items[1] === this.MessageCommands.GET_RETURN_KEY_TYPE) {
				client.onGetReturnKeyType();
			}

			if (items[1] === this.MessageCommands.SET_RETURN_KEY_DISABLE) {
				client.onSetReturnKeyDisable(items[2]);
			}
			if (items[1] === this.MessageCommands.GET_RETURN_KEY_DISABLE) {
				client.onGetReturnKeyDisable();
			}

			if (items[1] === this.MessageCommands.SET_LAYOUT) {
				client.onSetLayout(items[2]);
			}
			if (items[1] === this.MessageCommands.GET_LAYOUT) {
				client.onGetLayout();
			}

			if (items[1] === this.MessageCommands.RESET_INPUT_CONTEXT) {
				client.onResetInputContext(items[2]);
			}

			if (items[1] === this.MessageCommands.PROCESS_KEY_EVENT) {
				client.onProcessKeyEvent(items[2], items[3], items[4]);
			}
		};

		this.getAppropriateWsUrl = function() {
			return "ws://localhost:7681";
		};

		this.connectWebSocket = function() {
			if (typeof MozWebSocket != "undefined") {
				this.socket =
					new MozWebSocket(this.getAppropriateWsUrl(), "keyboard-protocol");
			} else {
				this.socket =
					new WebSocket(this.getAppropriateWsUrl(), "keyboard-protocol");
			}
		};

		this.prepare = function(key) {
			this.magicKey = key;
			return this.CLIENT_VERSION;
		};
		this.activate = function() {
			this.connectWebSocket();
			this.registerHandlers(this);
		};

		this.registerHandlers = function(handler) {
			try {
				this.socket.onopen = function() {
					this.send(
					handler.MessageTypes.PLAIN + " " +
					handler.MessageCommands.LOGIN + " " +
					handler.magicKey);
				};

				this.socket.onmessage = function(msg) {
					var items = msg.data.split(" ");
					handler.defaultHandler(items);
				};

				this.socket.onclose = function(evt) {
					/* Try to reconnect if disconnected uncleanly */
					if (evt.wasClean === false) {
						/*
						setTimeout((function(handler) {
							alert("connecting again!");
							this.connectWebSocket();
							this.registerHandlers(this);
						}).call(handler), 500);
						*/
					}
				};
			} catch(exception) {
				alert(exception);
			}
		};
	}
};
