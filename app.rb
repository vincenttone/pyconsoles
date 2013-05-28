#!/usr/bin/env ruby
# -*- coding: utf-8 -*-
require 'sinatra/base'
# Settings for all site actions.
module Sinatra
  class Base
    set :root, File.dirname(__FILE__)
    set :views, settings.root+'/templates'
    set :public_folder, settings.root+'/static'
    set :app_script, settings.root+'/scripts/app'
    set :assets_version, '10003'
  end
end
# Import all actions.
app_dir = File.dirname(__FILE__)
Dir[app_dir+'/actions/*.acts.rb'].each do |file|
  require "#{file}"
end
# Base app, start here.
module Spring
  class App < Sinatra::Base
    set :app, __FILE__
    use Home
  end
end
