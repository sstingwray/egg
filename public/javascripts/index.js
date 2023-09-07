(function() {
    'use strict';

    let app = {
        parameters: {
            animationDelay: 300
        },
        data: {},
        gizmoPatterns: {
            testGizmo: {
                title:'Test Gizmo',
                class: 'test-gizmo',
                btnPanel: '.test-gizmo-btn-panel',
                knobPanel: '.test-gizmo-knob-panel',
            },
        },
        components: {
            spinner: {},
            btnClose: {},
            btnTemplate: {},
            switchTemplate: {},
            gizmoTemplate: {},
            separatorTemplate: {},
            notificationTemplate: {},
        },
        containers: {
            gizmoBtnPanel: {},
            notificationPanel: {},
        }
    };

    app.fabricateButton = (btnClass, labelText, type, target, toDoFunction, container, hintText = '') => {
        let newBtn = app.components.btnTemplate.cloneNode(true);

        newBtn.classList.add('generated');
        newBtn.classList.add(btnClass);
        newBtn.classList.add('btn');
        newBtn.classList.remove ('template');

        newBtn.innerHTML = labelText;
        newBtn.title = hintText;

        switch (type) {
            case 'gizmo':
                $(newBtn).on('click', () => {
                    $(`.gizmo.${target}`).show();
                    $(`.gizmo.${target}`).addClass('active');
                    $(`.landing-page-content`).addClass('hidden');
                    $(app.components.btnClose).show();
                    $(app.components.btnClose).addClass('active');
                    $('.landing-page-content').addClass('blurred');
                    $('body').addClass('locked');
                });
                break;
            case 'link':
                $(newBtn).on('click', () => {
                    window.open(btnPattern.target, '_blank');
                });
                break;
        case 'function':
                $(newBtn).on('click', () => {
                    toDoFunction();
                });
                break;
            default:

                break;
        }
        container.appendChild(newBtn);
    };

    app.fabricateSwitch = (container, labelText, checkboxClass, checked = true, hintText = '') => {
        let newSwitch = app.components.switchTemplate.cloneNode(true);
        
        newSwitch.classList.add('generated');
        newSwitch.classList.remove ('template');
        newSwitch.querySelector('.label').innerHTML = labelText;
        newSwitch.querySelector('.label').title = hintText;
        newSwitch.querySelector('.switch').classList.add(checkboxClass);
        newSwitch.querySelector('input').checked = checked;

        container.appendChild(newSwitch);
    };

    app.addSeparator = (container) => {
        let newSeparator = app.components.separatorTemplate.cloneNode(true);

        newSeparator.classList.add('generated');
        newSeparator.classList.remove ('template');

        container.prepend(newSeparator);
    };
    
    app.confirmExecutionPopup = (confirmationText, toDoFunction) => {
        let form = document.querySelector('.confirm-form.form');
        let paragraph = form.querySelector('.confirmation-text');

        $('.popup').addClass('active');
        $('.form').hide();
        $('.confirm-form.form').show();
        $('.gizmo').addClass('blurred');

        paragraph.innerHTML = confirmationText;
        form.querySelector('.confirm.form-submit').focus();

        $(form.querySelector('.confirm.form-submit')).off();
        $(form.querySelector('.confirm.form-submit')).on('click', () => {
            toDoFunction();
            $('.close-popup-btn')[0].click();
        });
    };

    app.showNotificationToast = (text, type = '') => {
        let newNotification = app.components.notificationTemplate.cloneNode(true);

        newNotification.classList.add('generated');
        newNotification.classList.remove ('template');

        switch (type) {
            case 'positive':
                newNotification.classList.add('positive');
                break;
            case 'negative':
                newNotification.classList.add('negative');
                break;
            default:
                break;
        };

        newNotification.querySelector('.notification-text').innerHTML = text;

        $(newNotification).on('click', () => {
            newNotification.classList.add('fading');
            setTimeout(() => {
                newNotification.remove();
                if (!app.containers.notificationPanel.firstChild) $(app.containers.notificationPanel).hide();
            }, app.parameters.animationDelay);
        });

        setTimeout(() => {
            newNotification.classList.add('fading');
            setTimeout(() => {
                newNotification.remove();
                if (!app.containers.notificationPanel.firstChild) $(app.containers.notificationPanel).hide();
            }, app.parameters.animationDelay);
        }, 10*app.parameters.animationDelay);

        $(app.containers.notificationPanel).show();

        app.containers.notificationPanel.prepend(newNotification);
    };

    $(function() {
        app.containers.btnPanel = document.querySelector('.gizmos-panel');
        app.containers.notificationPanel = document.querySelector('.notification-panel');
        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnClose = document.querySelector('.close-btn');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.switchTemplate = document.querySelector('.switch-btn.template');
        app.components.gizmoTemplate = document.querySelector('.gizmo.template');
        app.components.separatorTemplate = document.querySelector('.separator.template');
        app.components.notificationTemplate = document.querySelector('.notification.template');

        Object.keys(app.gizmoPatterns).forEach(key => {
            app.fabricateButton(`${app.gizmoPatterns[key].class}-btn`, app.gizmoPatterns[key].title, 'gizmo', app.gizmoPatterns[key].class, null, app.containers.btnPanel);
        });
        
        $(app.components.spinner).hide();
        $(app.components.btnClose).hide();
        $(app.components.btnClose).removeClass('active');
        $('.gizmo').hide();
        $('.gizmo').removeClass('active');

        $('.logo').on('click', () => {
            window.location.href="/";
        });

        $(app.components.btnClose).on('click', () => {
            $(app.components.btnClose).removeClass('active');
            $('.gizmo').removeClass('active');
            $('.landing-page-content').removeClass('blurred');
            $(`.landing-page-content`).removeClass('hidden');
            $('body').removeClass('locked');
            setTimeout(() => {
                $('.gizmo').hide();
                $(app.components.btnClose).hide();
            }, app.parameters.animationDelay);
        });

        $('.cancel.form-submit.btn').on('click', () => {
            $('.close-popup-btn')[0].click();
        });

        $('.close-popup-btn').on('click', () => {
            $('.popup').removeClass('active');
            $('.form').hide();
            $('.gizmo').removeClass('blurred');
        });
        
    });

    function round(value, decimals = 0) {
        let returnNum = Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        return returnNum ? returnNum : 0;
    };

    function findNumberPosition(number, lower, upper) {
        let array = [];
        for (let i = lower; i < upper; i += 0.05) {
            array.push(i);
        };

        let L = 0;
        let R = array.length - 1;
        let m = 0;

        while (L <= R) {
            m = Math.floor((L + R)/2);
            if (array[m] + 0.1 < number)
                L = m + 1
            else if (array[m] - 0.1 > number)
                R = m - 1
            else
                return m/(array.length - 1)
        };

        return 0.5;
    };

    function shuffle(array) {
        let shuffledArray = array;
        let currentIndex = shuffledArray.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = shuffledArray[currentIndex];
          shuffledArray[currentIndex] = shuffledArray[randomIndex];
          shuffledArray[randomIndex] = temporaryValue;
        }
      
        return shuffledArray;
      };

})();