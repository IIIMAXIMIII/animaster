addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    let stopHeartBeating;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopHeartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            stopHeartBeating.stop();
        });
}



function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform({x: 100, y: 10}, 1.25);
    }

    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            return new Promise((resolve) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
                setTimeout(resolve, duration);
            });
        },

        /**
         * Блок плавно исчезает из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            return new Promise((resolve) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
                setTimeout(resolve, duration);
            });
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            return new Promise((resolve) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);
                setTimeout(resolve, duration);
            });
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            return new Promise((resolve) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, ratio);
                setTimeout(resolve, duration);
            });
        },

        wait(duration) {
            return new Promise((resolve) => {
                setTimeout(resolve, duration);
            });
        },

        async moveAndHide(element, duration) {
            const translation = {x: 100, y: 20};
            const durationMove = duration * 0.4;
            const durationHide = duration * 0.6;

            await this.move(element, durationMove, translation);
            await this.fadeOut(element, durationHide);
        },

        async showAndHide(element, duration) {
            const durationStep = duration / 3;

            await this.fadeIn(element, durationStep);
            await this.wait(durationStep);
            await this.fadeOut(element, durationStep);
        },

        heartBeating(element) {
            const ratio = 1.4;

            let isRunning = true;

            const animate = async () => {
                await this.scale(element, 500, ratio);
                await this.scale(element, 500, 1 / ratio);
                if (isRunning) {
                    setTimeout(animate, 0);
                }
            };

            animate();

            return {
                stop: () => {
                    isRunning = false;
                },
            };
        }
    };
}
