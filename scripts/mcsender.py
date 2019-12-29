import socket
from datetime import datetime

dateTimeObj = datetime.now()

timestampStr = dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S.%f)")
hostname = socket.gethostname()
message = "Message sent from host: " + hostname + " at " + timestampStr
MCAST_GRP = '239.0.0.1'
MCAST_PORT = 5007
# regarding socket.IP_MULTICAST_TTL
# ---------------------------------
# for all packets sent, after two hops on the network the packet will not
# be re-sent/broadcast (see https://www.tldp.org/HOWTO/Multicast-HOWTO-6.html)
MULTICAST_TTL = 2

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, MULTICAST_TTL)
sock.sendto(message, (MCAST_GRP, MCAST_PORT))
print "Sent: " + message + " to " + MCAST_GRP