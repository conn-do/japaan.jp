$(function() {
  /* スマートフォン用メニュー */
  var liHeight = $('nav li').height();

  function resizeNav() {
    liHeight = $('nav li').height();
    $('nav').css('height', liHeight);
  };

  resizeNav();

  $(window).resize(function() {
    resizeNav();
  });

  var smNav = {
    el: $('nav'),
    navOpened: false,

    on: function() {
      this.el.animate(
        {
          height: liHeight * 6
        },
        300,
        'linear',
        function() {
          $('nav li').css('display', 'block');
          smNav.navOpened = true;
        }
      );
    },
    off: function() {
      this.el.animate(
        {
          height: liHeight
        },
        300,
        'linear',
        function() {
          $('nav li:not(:first-of-type)').css('display', 'none');
          smNav.navOpened = false;
        }
      );
    },
    toggle: function() {
      if (!this.navOpened) {
        this.on();
      } else {
        this.off();
      }
    }
  }

  $('nav li:first-of-type').on('touchstart click', function() {
    smNav.toggle();
  });

  $(window).scroll(function() {
    if (smNav.navOpened) {
      smNav.off();
    }
  });

  $('nav li').on('touchstart click', function(event) {
    var linkTarget = $('a', this).attr('href');

    if (!linkTarget) {
      event.preventDefault();
      return false;
    }

    var targetOffset = $(linkTarget).offset().top;

    window.scrollTo(0, targetOffset - liHeight);
    window.history.pushState(null, linkTarget.substr(1), linkTarget);

    event.preventDefault();
  });

  /* #top Background Img 調整 */
  $(window).scroll(function() {
    var topY = $(window).scrollTop();
    $('#top').css('background-position', '0px ' + topY + 'px');

    if (topY === 0) {
      $('#top').css('background-position', '0px 0px');
    }
  });

  /* #work .thumbnail span width調整 */
  $('#work .thumbnail img').load(function () {
    setThumbSpanWidth();
  });

  $(window).resize(function() {
    setThumbSpanWidth();
  });

  function setThumbSpanWidth() {
    var thumbImgWidth = $('#work .thumbnail img').width();
    $('#work .thumbnail span').width(thumbImgWidth);
  }

  /* #skill .panel-group .panel-title .fa調整*/
  faChangeToUp( $('i', $('#skill .panel-group .collapse').first().prev()) );

  $('#skill .panel-group .collapse').on('shown.bs.collapse', function(event) {
    faChangeToUp($('i', $(this).first().prev()));
  });

  $('#skill .panel-group .collapse').on('hidden.bs.collapse', function(event) {
    faChangeToDown($('i', $(this).first().prev()));
  });

  function faChangeToDown($obj) {
    $obj.removeClass('fa-angle-up');
    $obj.addClass('fa-angle-down');
  }

  function faChangeToUp($obj) {
    $obj.removeClass('fa-angle-down');
    $obj.addClass('fa-angle-up');
  }

  /* #contact send Mail Validate */
  $('#contact .mail-form #mail-input').on('change click keyup keydown', function() {
    validateEmail();
  });

  $('#contact .mail-form #title-input').on('change click keyup', function() {
    validateTitle();
  });

  $('#contact .mail-form #body-input').on('change click keyup', function() {
    validateBody();
  });

  function validateEmail() {
    var $mail_input = $('#contact .mail-form #mail-input');
    var reg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var msg = '正しいメールアドレスを入力してください';

    return validate($mail_input, reg, msg);
  }

  function validateTitle() {
    var $title_input = $('#contact .mail-form #title-input');
    var reg = /^.{0,50}$/i;
    var msg = '50文字以内で入力してください';

    return validate($title_input, reg, msg);
  }

  function validateBody() {
    var $body_input = $('#contact .mail-form #body-input');
    var bodylen = $body_input.val().length;
    var msg = '500文字以内で入力してください ' + '現在:' + bodylen + '文字';
    var errorShown = $('.error-msg', $body_input.siblings('label')).get(0);

    if (bodylen > 500 || bodylen < 1) {
      if (errorShown) {
        $('.error-msg', $body_input.siblings('label')).remove();
      }

      $('span', $body_input.siblings('label')).after('<span class="error-msg">' + msg + '</span>');
    
      return false;
    }

    if (errorShown) {
      $('.error-msg', $body_input.siblings('label')).remove();
    }

    return true;
  }

  function validate($element, regex, msg) {
    var errorShown = $('.error-msg', $element.siblings('label')).get(0);

    if (!regex.test($element.val())) {
      if (!errorShown) {
        $('span', $element.siblings('label')).after('<span class="error-msg">' + msg + '</span>');
      }

      return false;
    }

    if (errorShown) {
      $('.error-msg', $element.siblings('label')).remove();
    }

    return true;
  }

  /* #contact .send-anime */
  var $left_fa = $('#contact .send-anime .left-fa i');
  var fa_pencil = 'fa-pencil';
  var fa_plane = 'fa-paper-plane-o';
  var isSend = false;

  $('#contact .send-btn').hover(
    function() {
      if (!isSend) {
        $left_fa.removeClass(fa_pencil);
        $left_fa.addClass(fa_plane);
        rotateLeftFa(360);
      }
    },
    function() {
      if (!isSend) {
        $left_fa.removeClass(fa_plane);
        $left_fa.addClass(fa_pencil);
        rotateLeftFa(-360);
      }
    }
  );

  var left_fa_moving = false;

  function rotateLeftFa(deg) {
    if (!left_fa_moving) {
      $left_fa.animate(
        {
          'z-index': 1
        },
        {
          duration: 600,
          step: function(now) {
            $(this).css({transform: 'rotate(' + (now * deg) + 'deg)'});
            left_fa_moving = true;
          },
          complete: function() {
            $(this).css('z-index', '0');
            left_fa_moving = false;
          }
        }
      );
    }
  }

  $('#contact .send-btn').click(function(event) {
    if (!validateEmail() | !validateTitle() | !validateBody() | isSend) {
      event.preventDefault();
      return;
    }

    var req_body = JSON.stringify({
      from: $('#contact .mail-form #mail-input').val(),
      title: $('#contact .mail-form #title-input').val(),
      body: $('#contact .mail-form #body-input').val()
    });

    $.ajax({
      url: 'sendMail.php',
      method: 'POST',
      data: req_body,
      dataType: 'json'
    })
    .fail(function(data) {
      var res = JSON.parse(data.responseText);
      var messages = res.messages;

      $.each(messages, function(i, val) {
        $('.error-panel').css('display', 'block');
        $('.error-panel .list-group').append('<li class="list-group-item">' + val + '</li>');
      });
    })
    .always(function(data) {
      if (data.status == 'success') {
        $('.error-panel').css('display', 'none');
        startAnimation();
        isSend = true;
      }
    });

    event.preventDefault();
  });

  function startAnimation() {
    var animations = [
      function() {
        $left_fa.animate(
          {
            top: -30,
            left: 40
          },
          {
            duration: 1000,
            step: function(now) {
              $(this).css({transform: 'rotate(' + (now * 1) + 'deg)'});
            },
            complete: function() {
              animations[1]();
            }
          }
        );
      },
      function() {
        $left_fa.animate(
          {
            left: $('#contact .send-anime .right-fa i').get(0).offsetLeft - 15 - 40
          },
          {
            duration: 2500,
            complete: function() {
              animations[2]();
            }
          }
        );
      },
      function() {
        $('#contact .send-anime .right-fa .fa-heart').css('right', '15x');

        $left_fa.animate(
          {
            left: $('#contact .send-anime .right-fa i').get(0).offsetLeft - 15,
            top: 0,
            opacity: 0
          },
          {
            duration: 1000,
          }
        );

        $('#contact .send-anime .right-fa .fa-home').hide(1000);
        $('#contact .send-anime .right-fa .fa-heart').show(1000);
      }
    ];

    animations[0]();

    $('button', '#contact .send-btn')
      .text('Thank you!')
      .css(
        {
          fontWeight: 'bold',
          cursor: 'default',
          background: '#FFD6FF',
          boxShadow: '0px 0px 3px #555'
        }
      );
  }

});