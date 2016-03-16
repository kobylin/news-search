DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

wget http://download.cdn.yandex.net/tomita/tomita-linux64.bz2
echo
echo "unzipping....."
bzip2 -d tomita-linux64.bz2
chmod u+x tomita-linux64
mv tomita-linux64.bz2

echo 
echo "tomita downloaded successfuly"