module Jekyll
	module String

		def to_slug(string)
      "#{string.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')}"
		end

	end
end

Liquid::Template.register_filter(Jekyll::String)