module Spring
  class Home < Sinatra::Base
    get '/' do
      haml :index
    end
  end
end
