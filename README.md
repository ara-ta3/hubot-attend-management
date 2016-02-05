# hubot-attend-management

[![Build Status](https://travis-ci.org/ara-ta3/hubot-attend-management.svg?branch=master)](https://travis-ci.org/ara-ta3/hubot-attend-management)

# About

This plugin manages some event's attendees.  
The events' source is based on google calendar.  
The attendees will be users in some chats.  

# Install

```
npm install --save hubot-attend-management

# and add hubot-attend-management plugin to external-scripts.json
vi external-scripts.json
...
```

# Usage

Please set two environmental variables.

* HUBOT_ATTEND_MANAGER_CREDENTIAL
  * service account key json file.
* HUBOT_ATTEND_MANAGER_CALENDARID
  * The google calendar id using for events list.
  * ex) xxxxx@group.calendar.google.com

```
> hubot attend attend latest
Shell attends to HogeEvent

> hubot attend status
HogeEvent( Sat Feb 06 2016 14:00:00 GMT+0900 (JST) ): Shell

> hubot attend cancel latest
Shell's attendance to HogeEventis canceled

> hubot attend event list
event idx for `attend` or `cancel`: 0
HogeEvent
Description: ...
Location: ...
Date: Sat Feb 06 2016 14:00:00 GMT+0900 (JST)
```
