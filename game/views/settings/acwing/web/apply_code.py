from django.http import JsonResponse
from urllib.parse import quote # 引入用于将链接转换为某种格式的工具，把特殊字符比如空格等换成别的表示方式
from random import randint # 引入用于生成随机数的
from django.core.cache import cache


def get_state(): # 获取8位随机数
    res = ""
    for i in range(8):
        res += str(randint(0, 9))
    return res


def apply_code(request):
    appid = 5745
    redirect_uri = quote("https://app5745.acapp.acwing.com.cn/settings/acwing/web/receive_code")  # 重定向链接，收到授权码之后的跳转
    scope = "userinfo"
    state = get_state()  # 生成s

    cache.set(state, True, 7200)  # 将state放到redis中，有效期为2小时

    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"

    return JsonResponse({  # 返回请求
        'result': "success",  # 测试
        'apply_code_url' : apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (
    appid, redirect_uri, scope, state),
    })

