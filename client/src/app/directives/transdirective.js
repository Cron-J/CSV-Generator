angular
    .module('app')
    .directive('graphiteAddFunc', function($compile,gfunc) {
      var inputTemplate = '<input type="text"'+
                            ' class="tight-form-input input-medium tight-form-input"' +
                            ' spellcheck="false" style="display:none"></input>';

      var buttonTemplate = '<a  class="tight-form-item tight-form-func dropdown-toggle"' +
                              ' tabindex="1" gf-dropdown="functionMenu" data-toggle="dropdown"' +
                              ' data-placement="top" ><i class="fa fa-plus"></i></a>';

      return {
        link: function($scope, elem) {
          var categories = gfunc.getCategories();
          var allFunctions = getAllFunctionNames(categories);

          $scope.functionMenu = createFunctionDropDownMenu(categories);

          var $input = $(inputTemplate);
          var $button = $(buttonTemplate);
          $input.appendTo(elem);
          $button.appendTo(elem);

          $input.attr('data-provide', 'typeahead');
          $input.typeahead({
            source: allFunctions,
            minLength: 1,
            items: 10,
            updater: function (value) {
              var funcDef = gfunc.getFuncDef(value);
              if (!funcDef) {
                // try find close match
                value = value.toLowerCase();
                funcDef = _.find(allFunctions, function(funcName) {
                  return funcName.toLowerCase().indexOf(value) === 0;
                });

                if (!funcDef) { return; }
              }

              $scope.$apply(function() {
                $scope.addFunction(funcDef);
              });

              $input.trigger('blur');
              return '';
            }
          });

          $button.click(function() {
            $button.hide();
            $input.show();
            $input.focus();
            elem.addClass('open');
          });

          $input.keyup(function() {
            elem.toggleClass('open', $input.val() === '');
          });

          $input.blur(function() {
            // clicking the function dropdown menu wont
            // work if you remove class at once
            setTimeout(function() {
              $input.val('');
              $input.hide();
              $button.show();
              elem.removeClass('open');
            }, 200);
          });

          $compile(elem.contents())($scope);
        }
      };
    });

  function getAllFunctionNames(categories) {
    return _.reduce(categories, function(list, category) {
      _.each(category, function(func) {
        list.push(func.name);
      });
      return list;
    }, []);
  }

  function createFunctionDropDownMenu(categories) {
    return _.map(categories, function(list, category) {
      return {
        text: category,
        submenu: _.map(list, function(value) {
          return {
            text: value.name,
            click: "addFunction('" + value.name + "')",
          };
        })
      };
    });
  }



  angular
    .module('app')
    .directive('gfDropdown', function ($parse, $compile, $timeout) {

      function buildTemplate(items, placement) {
        var upclass = placement === 'top' ? 'dropup' : '';
        var ul = [
          '<ul class="dropdown-menu ' + upclass + '" role="menu" aria-labelledby="drop1">',
          '</ul>'
        ];

        angular.forEach(items, function (item, index) {
          if (item.divider) {
            return ul.splice(index + 1, 0, '<li class="divider"></li>');
          }

          var li = '<li' + (item.submenu && item.submenu.length ? ' class="dropdown-submenu"' : '') + '>' +
            '<a tabindex="-1" ng-href="' + (item.href || '') + '"' + (item.click ? ' ng-click="' + item.click + '"' : '') +
              (item.target ? ' target="' + item.target + '"' : '') + (item.method ? ' data-method="' + item.method + '"' : '') +
              (item.configModal ? ' dash-editor-link="' + item.configModal + '"' : "") +
              '>' + (item.text || '') + '</a>';

          if (item.submenu && item.submenu.length) {
            li += buildTemplate(item.submenu).join('\n');
          }

          li += '</li>';
          ul.splice(index + 1, 0, li);
        });
        return ul;
      }

      return {
        restrict: 'EA',
        scope: true,
        link: function postLink(scope, iElement, iAttrs) {
          var getter = $parse(iAttrs.gfDropdown), items = getter(scope);
          $timeout(function () {
            var placement = iElement.data('placement');
            var dropdown = angular.element(buildTemplate(items, placement).join(''));
            dropdown.insertAfter(iElement);
            $compile(iElement.next('ul.dropdown-menu'))(scope);
          });

          iElement.addClass('dropdown-toggle').attr('data-toggle', 'dropdown');
        }
      };
    });



     angular
    .module('app')
    .directive('graphiteSegment', function($compile, $sce) {
      var inputTemplate = '<input type="text" data-provide="typeahead" ' +
                            ' class="tight-form-clear-input input-medium"' +
                            ' spellcheck="false" style="display:none"></input>';

      var buttonTemplate = '<a class="tight-form-item" tabindex="1" focus-me="segment.focus" ng-bind-html="segment.html"></a>';

      return {
        link: function($scope, elem) {
          var $input = $(inputTemplate);
          var $button = $(buttonTemplate);
          var segment = $scope.segment;
          var options = null;
          var cancelBlur = null;

          $input.appendTo(elem);
          $button.appendTo(elem);

          $scope.updateVariableValue = function(value) {
            if (value === '' || segment.value === value) {
              return;
            }

            $scope.$apply(function() {
              var selected = _.findWhere($scope.altSegments, { value: value });
              if (selected) {
                segment.value = selected.value;
                segment.html = selected.html;
                segment.expandable = selected.expandable;
              }
              else {
                segment.value = value;
                segment.html = $sce.trustAsHtml(value);
                segment.expandable = true;
              }
              $scope.segmentValueChanged(segment, $scope.$index);
            });
          };

          $scope.switchToLink = function(now) {
            if (now === true || cancelBlur) {
              clearTimeout(cancelBlur);
              cancelBlur = null;
              $input.hide();
              $button.show();
              $scope.updateVariableValue($input.val());
            }
            else {
              // need to have long delay because the blur
              // happens long before the click event on the typeahead options
              cancelBlur = setTimeout($scope.switchToLink, 350);
            }
          };

          $scope.source = function(query, callback) {
            if (options) { return options; }

            $scope.$apply(function() {
              $scope.getAltSegments($scope.$index).then(function() {
                options = _.map($scope.altSegments, function(alt) { return alt.value; });

                // add custom values
                if (segment.value !== 'select function' &&  _.indexOf(options, segment.value) === -1) {
                  options.unshift(segment.value);
                }

                callback(options);
              });
            });
          };

          $scope.updater = function(value) {
            if (value === segment.value) {
              clearTimeout(cancelBlur);
              $input.focus();
              return value;
            }

            $input.val(value);
            $scope.switchToLink(true);

            return value;
          };

          $input.attr('data-provide', 'typeahead');
          $input.typeahead({ source: $scope.source, minLength: 0, items: 10000, updater: $scope.updater });

          var typeahead = $input.data('typeahead');
          typeahead.lookup = function () {
            this.query = this.$element.val() || '';
            var items = this.source(this.query, $.proxy(this.process, this));
            return items ? this.process(items) : items;
          };

          $button.keydown(function(evt) {
            // trigger typeahead on down arrow or enter key
            if (evt.keyCode === 40 || evt.keyCode === 13) {
              $button.click();
            }
          });

          $button.click(function() {
            options = null;
            $input.css('width', ($button.width() + 16) + 'px');

            $button.hide();
            $input.show();
            $input.focus();

            var typeahead = $input.data('typeahead');
            if (typeahead) {
              $input.val('');
              typeahead.lookup();
            }
          });

          $input.blur($scope.switchToLink);

          $compile(elem.contents())($scope);
        }
      };
    });




angular
    .module('app')
    .directive('graphiteFuncEditor', function($compile, templateSrv) {
      var funcSpanTemplate = '<a ng-click="">{{func.def.name}}</a><span>(</span>';
      var paramTemplate = '<input type="text" style="display:none"' +
                          ' class="input-mini tight-form-func-param"></input>';

      var funcControlsTemplate =
         '<div class="tight-form-func-controls">' +
           '<span class="pointer fa fa-arrow-left"></span>' +
           '<span class="pointer fa fa-question-circle"></span>' +
           '<span class="pointer fa fa-remove" ></span>' +
           '<span class="pointer fa fa-arrow-right"></span>' +
         '</div>';

      return {
        restrict: 'A',
        link: function postLink($scope, elem) {
          var $funcLink = $(funcSpanTemplate);
          var $funcControls = $(funcControlsTemplate);
          var func = $scope.func;
          var funcDef = func.def;
          var scheduledRelink = false;
          var paramCountAtLink = 0;

          function clickFuncParam(paramIndex) {
            /*jshint validthis:true */

            var $link = $(this);
            var $input = $link.next();

            $input.val(func.params[paramIndex]);
            $input.css('width', ($link.width() + 16) + 'px');

            $link.hide();
            $input.show();
            $input.focus();
            $input.select();

            var typeahead = $input.data('typeahead');
            if (typeahead) {
              $input.val('');
              typeahead.lookup();
            }
          }

          function scheduledRelinkIfNeeded() {
            if (paramCountAtLink === func.params.length) {
              return;
            }

            if (!scheduledRelink) {
              scheduledRelink = true;
              setTimeout(function() {
                relink();
                scheduledRelink = false;
              }, 200);
            }
          }

          function inputBlur(paramIndex) {
            /*jshint validthis:true */
            var $input = $(this);
            var $link = $input.prev();
            var newValue = $input.val();

            if (newValue !== '' || func.def.params[paramIndex].optional) {
              $link.html(templateSrv.highlightVariablesAsHtml(newValue));

              func.updateParam($input.val(), paramIndex);
              scheduledRelinkIfNeeded();

              $scope.$apply($scope.targetChanged);
            }

            $input.hide();
            $link.show();
          }

          function inputKeyPress(paramIndex, e) {
            /*jshint validthis:true */
            if(e.which === 13) {
              inputBlur.call(this, paramIndex);
            }
          }

          function inputKeyDown() {
            /*jshint validthis:true */
            this.style.width = (3 + this.value.length) * 8 + 'px';
          }

          function addTypeahead($input, paramIndex) {
            $input.attr('data-provide', 'typeahead');

            var options = funcDef.params[paramIndex].options;
            if (funcDef.params[paramIndex].type === 'int') {
              options = _.map(options, function(val) { return val.toString(); });
            }

            $input.typeahead({
              source: options,
              minLength: 0,
              items: 20,
              updater: function (value) {
                setTimeout(function() {
                  inputBlur.call($input[0], paramIndex);
                }, 0);
                return value;
              }
            });

            var typeahead = $input.data('typeahead');
            typeahead.lookup = function () {
              this.query = this.$element.val() || '';
              return this.process(this.source);
            };
          }

          function toggleFuncControls() {
            var targetDiv = elem.closest('.tight-form');

            if (elem.hasClass('show-function-controls')) {
              elem.removeClass('show-function-controls');
              targetDiv.removeClass('has-open-function');
              $funcControls.hide();
              return;
            }

            elem.addClass('show-function-controls');
            targetDiv.addClass('has-open-function');

            $funcControls.show();
          }

          function addElementsAndCompile() {
            $funcControls.appendTo(elem);
            $funcLink.appendTo(elem);

            _.each(funcDef.params, function(param, index) {
              if (param.optional && func.params.length <= index) {
                return;
              }

              if (index > 0) {
                $('<span>, </span>').appendTo(elem);
              }

              var paramValue = templateSrv.highlightVariablesAsHtml(func.params[index]);
              var $paramLink = $('<a ng-click="" class="graphite-func-param-link">' + paramValue + '</a>');
              var $input = $(paramTemplate);

              paramCountAtLink++;

              $paramLink.appendTo(elem);
              $input.appendTo(elem);

              $input.blur(_.partial(inputBlur, index));
              $input.keyup(inputKeyDown);
              $input.keypress(_.partial(inputKeyPress, index));
              $paramLink.click(_.partial(clickFuncParam, index));

              if (funcDef.params[index].options) {
                addTypeahead($input, index);
              }

            });

            $('<span>)</span>').appendTo(elem);

            $compile(elem.contents())($scope);
          }

          function ifJustAddedFocusFistParam() {
            if ($scope.func.added) {
              $scope.func.added = false;
              setTimeout(function() {
                elem.find('.graphite-func-param-link').first().click();
              }, 10);
            }
          }

          function registerFuncControlsToggle() {
            $funcLink.click(toggleFuncControls);
          }

          function registerFuncControlsActions() {
            $funcControls.click(function(e) {
              var $target = $(e.target);
              if ($target.hasClass('fa-remove')) {
                toggleFuncControls();
                $scope.$apply(function() {
                  $scope.removeFunction($scope.func);
                });
                return;
              }

              if ($target.hasClass('fa-arrow-left')) {
                $scope.$apply(function() {
                  _.move($scope.functions, $scope.$index, $scope.$index - 1);
                  $scope.targetChanged();
                });
                return;
              }

              if ($target.hasClass('fa-arrow-right')) {
                $scope.$apply(function() {
                  _.move($scope.functions, $scope.$index, $scope.$index + 1);
                  $scope.targetChanged();
                });
                return;
              }

              if ($target.hasClass('fa-question-circle')) {
                window.open("http://graphite.readthedocs.org/en/latest/functions.html#graphite.render.functions." + funcDef.name,'_blank');
                return;
              }
            });
          }

          function relink() {
            elem.children().remove();

            addElementsAndCompile();
            ifJustAddedFocusFistParam();
            registerFuncControlsToggle();
            registerFuncControlsActions();
          }

          relink();
        }
      };

    });

angular
    .module('app')
    .directive('prevDefault', function() {
      return{
        restrict:'A',
        link:function(scope,ele,attr){
          ele.bind('click',function(event){
            event.stopPropagation();
          })
        }
      }
      

    });