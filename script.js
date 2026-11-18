

function randomNumber(max) {
    var cryptoObject = window.crypto || window.msCrypto;

    if (!cryptoObject || !cryptoObject.getRandomValues) {
        throw new Error(
            "Браузер не поддерживает безопасную генерацию случайных чисел."
        );
    }

    var array = new Uint32Array(1);
    var limit = Math.floor(4294967296 / max) * max;

    do {
        cryptoObject.getRandomValues(array);
    } while (array[0] >= limit);

    return array[0] % max;
}

function generatePassword() {
    var length = parseInt(
        document.getElementById("length").value,
        10
    );

    var useNumbers =
        document.getElementById("numbers").checked;

    var useSymbols =
        document.getElementById("symbols").checked;

    var letters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var digits = "0123456789";
    var symbols = "!@#$%^&*()_+-=[]{}?";

    var characters = letters;

    if (useNumbers) {
        characters += digits;
    }

    if (useSymbols) {
        characters += symbols;
    }

    if (isNaN(length) || length < 4 || length > 50) {
        document.getElementById("message").innerHTML =
            "Укажи длину от 4 до 50 символов.";
        return;
    }

    var password = "";

    try {
        for (var i = 0; i < length; i++) {
            password += characters.charAt(
                randomNumber(characters.length)
            );
        }
    } catch (error) {
        document.getElementById("message").innerHTML =
            "Ошибка: " + error.message;
        return;
    }

    document.getElementById("password").value = password;
    document.getElementById("message").innerHTML =
        "Пароль успешно создан!";

    checkPassword();
}

function copyPassword() {
    var field = document.getElementById("password");

    if (!field.value) {
        document.getElementById("message").innerHTML =
            "Сначала создай пароль.";
        return;
    }

    field.focus();
    field.select();

    try {
        var copied = document.execCommand("copy");

        document.getElementById("message").innerHTML =
            copied ? "Пароль скопирован!" :
            "Не удалось скопировать пароль.";
    } catch (error) {
        document.getElementById("message").innerHTML =
            "Выдели пароль и скопируй его вручную.";
    }
}

function checkPassword() {
    var password =
        document.getElementById("password").value;

    var score = 0;

    var checks = [
        password.length > 8,
        password.length > 12,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password)
    ];

    var names = ["c1", "c2", "c3", "c4", "c5"];

    for (var i = 0; i < checks.length; i++) {
        var item = document.getElementById(names[i]);

        if (checks[i]) {
            score++;
            item.style.color = "#38bdf8";
            item.innerHTML = "✓ " + item.innerHTML.replace(/^✓ /, "");
        } else {
            item.style.color = "#cbd5e1";
            item.innerHTML = item.innerHTML.replace(/^✓ /, "");
        }
    }

    var text = "Слабый";

    if (score >= 4) {
        text = "Надёжный";
    } else if (score >= 2) {
        text = "Средний";
    }

    if (password.length === 0) {
        text = "Ожидание пароля";
    }

    document.getElementById("strengthText").innerHTML = text;

    document.getElementById("progressFill").style.width =
        (score * 20) + "%";
}

document.getElementById("password").oninput = checkPassword;