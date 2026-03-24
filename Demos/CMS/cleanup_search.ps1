$f = 'c:\Users\Produ\Documents\luma-v2.0.0\Demos\CMS\search.html'
$c = Get-Content $f
# Keep lines 1-687 and 753-end
# Lines 688 to 752 are removed.
# 0-indexed: keep 0..686 and 752..end
$new = $c[0..686] + $c[752..($c.Count - 1)]
$new | Set-Content $f
