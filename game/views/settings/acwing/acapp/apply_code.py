from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache


def get_state():
    res = ""
    for i in range(8):
        res = str(randint(0, 9))
    return res

def apply_code(request):
    appid = 5745
    redirect_uri = quote("https://strivelee.com/settings/acwing/acapp/receive_code")  # 重定向链接，收到授权码之后的跳转
    scope = "userinfo"
    state = get_state()

    cache.set(state, True, 7200)  # 将state放到redis中，有效期为2小时

    return JsonResponse({
        'result': "success",
        'appid': appid,
        'redirect_uri': redirect_uri,
        'scope': scope,
        'state': state,
    })