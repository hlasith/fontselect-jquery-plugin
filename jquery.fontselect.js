/*
 * jQuery.fontselect - A font selector for the Google Web Fonts api
 * Tom Moor, http://tommoor.com
 * Copyright (c) 2011 Tom Moor
 * MIT Licensed
 * @version 0.1
 */

(function ($) {

    $.fn.fontselect = function (options) {

        var __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        };

        var settings = {
            style: options.style ? options.style : 'font-select',
            placeholder: options.placeholder ? options.placeholder : 'Select a font',
            lookahead: options.lookahead ? options.lookahead : 2,
            api: '//fonts.googleapis.com/css?family=',
            fontPath: options.fontPath ? options.fontPath : '',
            addNoneOption: true
        };

        var Fontselect = (function () {

            function Fontselect(original, o) {
                this.$original = $(original);
                this.options = o;
                this.active = false;
                this.setupHtml();
                this.getVisibleFonts();
                this.bindEvents();

                var font = this.$original.val();
                if (font) {
                    this.updateSelected();
                    this.addFontLink(font);
                }
            }

            Fontselect.prototype.bindEvents = function () {
                $('li', this.$results)
                    .click(__bind(this.selectFont, this))
                    .mouseenter(__bind(this.activateFont, this))
                    .mouseleave(__bind(this.deactivateFont, this));
                 $(this.$results).mouseleave(__bind(this.toggleDrop, this));
                $('span', this.$select).click(__bind(this.toggleDrop, this));
                this.$arrow.click(__bind(this.toggleDrop, this));

            };

            Fontselect.prototype.toggleDrop = function (ev) {

                if (this.active) {
                    this.$element.removeClass('font-select-active');
                    this.$drop.hide();
                    clearInterval(this.visibleInterval);

                } else {
                    this.$element.addClass('font-select-active');
                    this.$drop.show();
                    this.moveToSelected();
                    this.visibleInterval = setInterval(__bind(this.getVisibleFonts, this), 500);
                }

                this.active = !this.active;
            };

            Fontselect.prototype.selectFont = function () {

                var font = $('li.active', this.$results).data('value');
                this.$original.val(font).change();
                this.updateSelected();
                this.toggleDrop();
            };

            Fontselect.prototype.moveToSelected = function () {

                var $li, font = this.$original.val();

                if (font) {
                    $li = $("li[data-value='" + font + "']", this.$results);
                } else {
                    $li = $("li", this.$results).first();
                }

                this.$results.scrollTop($li.addClass('active').position().top);
            };

            Fontselect.prototype.activateFont = function (ev) {
                $('li.active', this.$results).removeClass('active');
                $(ev.currentTarget).addClass('active');
            };

            Fontselect.prototype.deactivateFont = function (ev) {

                $(ev.currentTarget).removeClass('active');
            };

            Fontselect.prototype.updateSelected = function () {

                var font = this.$original.val();
                $('span', this.$element).text(this.toReadable(font)).css(this.toStyle(font));

                var str = "";
                var isVariants = false;
                var isSubsets = false;
                var strCheckbox = "";


                $.each(fontData[font], function (index, item) {
                    if (index = "variants") {
                        isVariants = true;
                    }
                    ;
                    if (index = "subsets") {
                        isSubsets = true;
                    }
                    ;

                });
                var savedFontUrl = "";

                if (isVariants) {

                    str = str + "<div class='fontInfo'>" + "variants" + "<br/>";

                    var prevElementId = this.$element.prev().attr('id');

                    savedFontUrl = this.$element.prev().attr('data-variant-weight');

                    var variantChecked = "checked";

                    $.each(fontData[font]["variants"], function (subIndex, subItem) {

                        $.each(subItem, function (index, value) {


                            if (subIndex == "italic") {
                                variantChecked = Fontselect.prototype.checkboxVariantSelect(savedFontUrl, index + 'i', font, 'italic');
                                strCheckbox = '<div class="checkbox"> <label><input type="checkbox" name="' + prevElementId + '" data-font-name="' + font + '" data-variant="" data-weight="' + index + 'i" ' + variantChecked + '>italic ' + index + '</label></div>';
                            } else {
                                variantChecked = Fontselect.prototype.checkboxVariantSelect(savedFontUrl, index, font, 'normal');
                                strCheckbox = '<div class="checkbox"> <label><input type="checkbox" name="' + prevElementId + '" data-font-name="' + font + '" data-variant="" data-weight="' + index + '" ' + variantChecked + '>' + index + '</label></div>';
                            }
                            str = str + strCheckbox;
                        });


                    });
                }

                if (isSubsets) {
                    var subsetChecked = "checked";
                    str = str + "</div><div class='fontInfo'>" + "subsets" + "<br/>";
                    $.each(fontData[font]["subsets"], function (subIndex, subItem) {
                        subsetChecked = Fontselect.prototype.checkboxSubsetSelect(savedFontUrl, subItem, font);
                        var strCheckbox = '<div class="checkbox"> <label><input type="checkbox" name="subset-' + prevElementId + '" data-font-name="' + font + '" data-value="' + subItem + '" ' + subsetChecked + '>' + subItem + '</label></div>';

                        str = str + strCheckbox;

                    });
                }

                this.$element.find('.fontOptions').remove();

                var thisElement = this.$element;

                this.$element.append('<div id ="' + prevElementId + 'FontOptions" class ="fontOptions">' + str + '</div></div>');

                Fontselect.prototype.generateUrl(prevElementId, prevElementId);


                this.$element.find('.checkbox').click(function () {

                    var clickedInput = $(this).find('input').attr('name');
                    Fontselect.prototype.generateUrl(clickedInput, prevElementId);

                });

            };

            Fontselect.prototype.checkboxSubsetSelect = function (savedFontUrl, searchString, fontName) {
                var subsetChecked = "";
                var savedFontUrlSubset = savedFontUrl;
                if (savedFontUrl != undefined) {

                        if (savedFontUrlSubset.indexOf(fontName) == -1) {
                            subsetChecked = "";
                        } else if (searchString.indexOf("-ext") == -1) {
                            savedFontUrlSubset = savedFontUrlSubset.replace(searchString + '-ext', "");
                            if(savedFontUrlSubset.indexOf(searchString) != -1){
                                subsetChecked = "checked";
                            }else {
                                subsetChecked = "";
                            }

                        }else {
                            if(savedFontUrlSubset.indexOf(searchString) != -1){
                                subsetChecked = "checked";
                            }else {
                                subsetChecked = "";
                            }
                        }

                }

                return subsetChecked;
            }

            Fontselect.prototype.checkboxVariantSelect = function (savedFontUrl, searchString, fontName, variant) {
                var variantChecked = "";
                if (savedFontUrl != undefined) {
                    if (variant == "italic") {
                        if (savedFontUrl.indexOf(searchString) == -1 && savedFontUrl.indexOf(fontName) != -1) {
                            variantChecked = "";
                        } else {
                            variantChecked = "checked";
                        }
                    } else {
                        savedFontUrl = savedFontUrl.replace(searchString + 'i', "");
                        if (savedFontUrl != undefined && savedFontUrl.indexOf(searchString) == -1 && savedFontUrl.indexOf(fontName) != -1) {
                            variantChecked = "";
                        } else {
                            variantChecked = "checked";
                        }
                    }
                }

                return variantChecked;
            }

            Fontselect.prototype.generateUrl = function (clickedInput, prevElementId) {
                clickedInput = clickedInput.replace("subset-", "");

                var variants = $("input[name='" + clickedInput + "']:checked");
                var variantLen = variants.length;
                var separator = ","

                weightStr = $("input[name='subset-" + clickedInput + "']:checked, input[name='" + clickedInput + "']:checked").first().data('font-name') + ':';

                $("input[name='" + clickedInput + "']:checked").each(function (index, data) {

                    if (index == variantLen - 1) {
                        separator = "";
                    }
                    weightStr = weightStr + $(this).data('weight') + separator;

                });

                var subsets = $("input[name='subset-" + clickedInput + "']:checked");
                var len = subsets.length;
                separator = ","

                // check for subsets
                if (len > 0) {
                    weightStr = weightStr + '&subset=';
                }


                subsets.each(function (index, data) {
                    if (index == len - 1) {
                        separator = "";
                    }
                    weightStr = weightStr + $(this).data('value') + separator;
                });

                $('#' + prevElementId).attr('data-variant-weight', weightStr);
            }

            Fontselect.prototype.setupHtml = function () {

                this.$original.empty().hide();
                this.$element = $('<div>', {'class': this.options.style});
                this.$arrow = $('<div><b></b></div>');
                this.$select = $('<a><span>' + this.options.placeholder + '</span></a>');
                this.$drop = $('<div>', {'class': 'fs-drop'});
                this.$results = $('<ul>', {'class': 'fs-results'});
                this.$original.after(this.$element.append(this.$select.append(this.$arrow)).append(this.$drop));
                this.$drop.append(this.$results.append(this.fontsAsHtml())).hide();
            };

            Fontselect.prototype.fontsAsHtml = function () {

                var fontsNew = []
                $.each(fontData, function (index, item) {
                    fontsNew.push(index);
                });
                fonts = fontsNew;
                var l = fonts.length;
                var r, s, h = '';

                for (var i = 0; i < l; i++) {
                    r = this.toReadable(fonts[i]);
                    s = this.toStyle(fonts[i]);
                    h += '<li data-value="' + fonts[i] + '" style="font-family: ' + s['font-family'] + '; font-weight: ' + s['font-weight'] + '; font-style: ' + s['font-style'] + ';">' + r + '</li>';
                }

                return h;
            };

            Fontselect.prototype.toReadable = function (font) {
                return font.replace(/[\+|:]/g, ' ');
            };

            Fontselect.prototype.toStyle = function (font) {
                var t = font.split(':');
                var fontStyle = "";
                if (typeof t[1] != 'undefined') {
                    if (t[1] == "italic") {
                        fontStyle = "italic";
                        t[1] == "normal";
                    } else if (t[1].indexOf('italic') != -1) {
                        t[1] = t[1].replace("italic", "");
                        fontStyle = "italic";
                    }
                    ;
                }

                return {'font-family': this.toReadable(t[0]), 'font-weight': (t[1] || 'normal'), 'font-style': fontStyle};
            };

            Fontselect.prototype.getVisibleFonts = function () {

                if (this.$results.is(':hidden')) return;

                var fs = this;
                var top = this.$results.scrollTop();
                var bottom = top + this.$results.height();

                if (this.options.lookahead) {
                    var li = $('li', this.$results).first().height();
                    bottom += li * this.options.lookahead;
                }

                $('li', this.$results).each(function () {

                    var ft = $(this).position().top + top;
                    var fb = ft + $(this).height();

                    if ((fb >= top) && (ft <= bottom)) {
                        var font = $(this).data('value');
                        fs.addFontLink(font);
                    }

                });
            };

            Fontselect.prototype.getDefaultFontWeight = function (font) {
                var defaultFontValue = "";

                if (undefined != fontData[font]["variants"]["normal"]["400"] ){

                    return 400;

                }else {
                    $.each(fontData[font]["variants"], function (subIndex, subItem) {

                        $.each(subItem, function (index, value) {

                            defaultFontValue = index;
                            return false;

                        });

                        return false;
                    });
                }



                return defaultFontValue;
            }

            Fontselect.prototype.addFontLink = function (font) {

                var defaultFontWeight = Fontselect.prototype.getDefaultFontWeight(font);

                // check if local font path exist else get fonts from google
                if (this.options.fontPath != "" && this.options.fontPath != undefined ) {
                    var fontLink =  font.replace(/ /g, "_");
                    var link = this.options.fontPath + fontLink + ".css";

                    if ($("link[href*='" + font + "']").length === 0) {
                        $('link:last').after('<link href="' + link + '" rel="stylesheet" type="text/css">');
                    }
                }else {
                    
                    var link = this.options.api + font + ":" + defaultFontWeight;

                    if ($("link[href*='" + font + "']").length === 0) {
                        $('link:last').after('<link href="' + link + '" rel="stylesheet" type="text/css">');
                    }
                    
                }


            };

            return Fontselect;
        })();

        return this.each(function (options) {
            // If options exist, lets merge them
            if (options) $.extend(settings, options);

            return new Fontselect(this, settings);
        });

    };
})(jQuery);
