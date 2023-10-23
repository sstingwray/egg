(function() {
    'use strict';

    let app = {
        parameters: {
            animationDelay: 300
        },
        data: {
            images: {
                demonschool: [
                    { file:'demonschool/1.png', text: '' },
                    { file:'demonschool/2.png', text: '' },
                    { file:'demonschool/3.png', text: '' },
                    { file:'demonschool/4.png', text: '' },
                    { file:'demonschool/5.png', text: '' },
                    { file:'demonschool/6.png', text: '' },
                    { file:'demonschool/7.png', text: '' },
                    { file:'demonschool/8.png', text: '' },
                ],
                xenocrisis: [
                    { file:'xenocrisis/1.png', text: '' },
                    { file:'xenocrisis/2.png', text: '' },
                    { file:'xenocrisis/3.png', text: '' },
                    { file:'xenocrisis/4.png', text: '' },
                    { file:'xenocrisis/5.png', text: '' },
                    { file:'xenocrisis/6.png', text: '' },
                ],
                idol: [
                    { file:'idol-manager/1.png', text: '' },
                    { file:'idol-manager/2.gif', text: '' },
                    { file:'idol-manager/3.png', text: '' },
                    { file:'idol-manager/4.png', text: '' },
                    { file:'idol-manager/5.gif', text: '' },
                ],
                x198: [
                    { file:'x198/1.gif', text: '' },
                    { file:'x198/2.gif', text: '' },
                    { file:'x198/3.gif', text: 'Characters by me, background by another artist.' },
                    { file:'x198/4.gif', text: 'Characters by me, background by another artist.' },
                    { file:'x198/5.png', text: '' },
                    { file:'x198/6.png', text: '' },
                    { file:'x198/7.png', text: '' },
                    { file:'x198/8.png', text: '' },
                ],
                misc: [
                    { file:'misc/1.png', text: '' },
                    { file:'misc/2.png', text: '' },
                    { file:'misc/3.png', text: '' },
                ],
                personal: [
                    { file:'personal/1.gif', text: '' },
                    { file:'personal/2.png', text: '' },
                    { file:'personal/3.png', text: '' },
                    { file:'personal/4.png', text: '' },
                    { file:'personal/5.png', text: '' },
                    { file:'personal/6.png', text: '' },
                    { file:'personal/7.png', text: '' },
                    { file:'personal/8.gif', text: '' },
                    { file:'personal/9.png', text: '' },
                    { file:'personal/10.png', text: '' },
                    { file:'personal/11.png', text: '' },
                    { file:'personal/12.png', text: '' },
                    { file:'personal/13.png', text: '' },
                    { file:'personal/14.png', text: '' },
                    { file:'personal/15.png', text: '' },
                    { file:'personal/16.jpg', text: '' },
                    { file:'personal/17.png ', text: '' },
                    { file:'personal/18.gif', text: '' },
                ]
            }
        },
        components: {},
        containers: {}
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

    app.fabricateImageCard = (container, img, text, id) => {
        let newImageCard = app.components.imageCardTemplate.cloneNode(true);

        newImageCard.classList.add('generated');
        newImageCard.classList.remove ('template');
        newImageCard.id = id;
        newImageCard.style.transform = `rotate(${Math.random()*2-1}deg)`;
        newImageCard.querySelector('.img-overlay > .img-text > p').innerHTML = text;
        newImageCard.querySelector('.img-overlay').classList.add('no-text');
        newImageCard.querySelector('.card-img').src = `images/full/${img}`;

        container.appendChild(newImageCard);
    }

    app.addSeparator = (container) => {
        let newSeparator = app.components.separatorTemplate.cloneNode(true);

        newSeparator.classList.add('generated');
        newSeparator.classList.remove ('template');

        container.prepend(newSeparator);
    };
    
    app.showPopup = (text, img) => {
        let form = document.querySelector('.img-form');
        let paragraph = form.querySelector('.popup-img-text');
        let image = form.querySelector('.popup-img');

        $('.popup').addClass('active');
        $('.landing-page-content').addClass('blurred');

        paragraph.innerHTML = text;
        image.src = img;

        $(form.querySelector('.confirm.form-submit')).off();
        $(form.querySelector('.confirm.form-submit')).on('click', () => {
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
        let popupOpen = false;
        let lastClickedImgCard = '';

        app.containers.header = document.querySelector('.header');
        app.containers.notificationPanel = document.querySelector('.notification-panel');
        app.containers.demonschoolContainer = document.querySelector('.demonschool-container');
        app.containers.xenocrisisContainer = document.querySelector('.xenocrisis-container');
        app.containers.idolManagerContainer = document.querySelector('.idol-container');
        app.containers.x198Container = document.querySelector('.x198-container');
        app.containers.miscContainer = document.querySelector('.misc-container');
        app.containers.artContrainer = document.querySelector('.art-container');
        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.switchTemplate = document.querySelector('.switch-btn.template');
        app.components.separatorTemplate = document.querySelector('.separator.template');
        app.components.notificationTemplate = document.querySelector('.notification.template');
        app.components.imageCardTemplate = document.querySelector('.card.image.template');

        {
            Object.keys(app.data.images).forEach(key => {
                app.data.images[key].forEach((image, index)  => {
                    app.fabricateImageCard(document.querySelector(`.${key}-container`), image.file, image.text, `${key}-${index}`);
                });
            });
        }

        setTimeout(() => {
            $(app.components.spinner).hide();
        }, 1000);

        {
            document.addEventListener('keydown', (e) => {
                console.log(e.key);
                if (popupOpen) {
                    if (e.key == 'ArrowRight') {
                        $(`#${lastClickedImgCard}`).next().trigger('click');
                    } else if (e.key == 'ArrowLeft') {
                        $(`#${lastClickedImgCard}`).prev().trigger('click');
                    }
                }
            });
        }
        

        $('.card.image').on('click', (event) => {
            let title = event.currentTarget.parentNode.parentNode.querySelector('h1').innerHTML;
            let descr = event.currentTarget.parentNode.parentNode.querySelector('h3').innerHTML;
            let text = event.currentTarget.children[0].children[0].children[0].innerHTML;
            let src = event.currentTarget.children[1].src;
            app.showPopup(`${title} — ${descr}<br>${text}`, src);
            popupOpen = true;
            lastClickedImgCard = event.currentTarget.id;
        });

        $('.logo').on('click', () => {
            window.location.href="/";
        });

        $('.close-popup-btn').on('click', () => {
            $('.popup').removeClass('active');
            $('.landing-page-content').removeClass('blurred');
            popupOpen = false;
        });

        $('.popup-img-underlay').on('click', (event) => {
            event.stopPropagation();
            $('.close-popup-btn').trigger('click');
        });
        
        $('.popup-scroll-btn.left').on('click', () => {
            $(`#${lastClickedImgCard}`).prev().trigger('click');
        });

        $('.popup-scroll-btn.right').on('click', () => {
            $(`#${lastClickedImgCard}`).next().trigger('click');
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