module Jekyll
	module Color

		def transparentize(hex, alpha, adjust_amount=0)
  		if adjust_amount != 0
    		hex = adjust_color(hex, adjust_amount)
      end
  		
      rgb = hex.gsub('#', '').scan(/../).map {|color| color.to_i(16)}
      if alpha < 1
        "rgba(#{rgb[0]}, #{rgb[1]}, #{rgb[2]}, #{alpha})"
      else
        "hex"
      end
		end
		
    # Amount should be a decimal between -1 and 1. Lower means darker
    def adjust_color(hex_color, amount=0.4)
      hex_color = hex_color.gsub('#','')
      rgb = hex_color.scan(/../).map {|color| color.hex}
      
      if amount > 0
        rgb[0] = (rgb[0].to_i * amount).round
        rgb[1] = (rgb[1].to_i * amount).round
        rgb[2] = (rgb[2].to_i * amount).round
      else
        rgb[0] = [(rgb[0].to_i + 255 * amount).round, 255].min
        rgb[1] = [(rgb[1].to_i + 255 * amount).round, 255].min
        rgb[2] = [(rgb[2].to_i + 255 * amount).round, 255].min
      end
      "#%02x%02x%02x" % rgb
    end

	end
end

Liquid::Template.register_filter(Jekyll::Color)